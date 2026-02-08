/**
 * Formé Haus Payment Customization Function
 * 
 * This Shopify Function restricts Cash on Delivery (COD) based on:
 * 1. Shipping city (only Riyadh, Jeddah, Dammam allowed for COD)
 * 2. Order total (COD only for orders between 100 SAR and 5000 SAR)
 * 3. Customer tags (blocked customers cannot use COD)
 * 
 * Target: payment_customization
 */

use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Input {
    #[serde(rename = "purchaseProposal")]
    purchase_proposal: PurchaseProposal,
    #[serde(rename = "paymentMethods")]
    payment_methods: Vec<PaymentMethod>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct PurchaseProposal {
    delivery: Delivery,
    totals: Totals,
    buyer_identity: Option<BuyerIdentity>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Delivery {
    address: Option<Address>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Address {
    city: Option<String>,
    province_code: Option<String>,
    country_code: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Totals {
    total_price: Price,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Price {
    amount: String,
    currency_code: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct BuyerIdentity {
    customer: Option<Customer>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Customer {
    id: String,
    tags: Vec<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct PaymentMethod {
    id: String,
    name: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct Output {
    operations: Vec<Operation>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct Operation {
    r#type: String,
    hide: Option<HideOperation>,
    reorder: Option<ReorderOperation>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct HideOperation {
    payment_method_id: String,
    message: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct ReorderOperation {
    payment_method_id: String,
    index: u32,
}

// COD Payment Method ID (standard Shopify COD)
const COD_PAYMENT_METHOD_ID: &str = "shopify_payments_cash_on_delivery";

// Cities where COD is allowed
const ALLOWED_COD_CITIES: [&str; 10] = [
    "Riyadh",
    "Jeddah", 
    "Dammam",
    "Khobar",
    "Dhahran",
    "Makkah",
    "Madinah",
    "Taif",
    "Tabuk",
    "Abha"
];

// Customer tags that block COD
const BLOCKED_COD_TAGS: [&str; 3] = [
    "cod_blocked",
    "fraud_risk",
    "payment_default"
];

fn main() {
    let input: Input = serde_json::from_reader(std::io::stdin())
        .expect("Failed to parse input JSON");

    let operations = evaluate_payment_methods(&input);

    let output = Output { operations };
    
    println!("{}", serde_json::to_string(&output).unwrap());
}

fn evaluate_payment_methods(input: &Input) -> Vec<Operation> {
    let mut operations: Vec<Operation> = Vec::new();

    // Get shipping city
    let shipping_city = input.purchase_proposal.delivery.address
        .as_ref()
        .and_then(|addr| addr.city.as_ref())
        .map(|city| city.to_lowercase());

    // Get order total
    let order_total: f64 = input.purchase_proposal.totals.total_price.amount
        .parse()
        .unwrap_or(0.0);

    // Check if customer is blocked
    let is_customer_blocked = input.purchase_proposal.buyer_identity
        .as_ref()
        .and_then(|identity| identity.customer.as_ref())
        .map(|customer| {
            customer.tags.iter().any(|tag| {
                BLOCKED_COD_TAGS.contains(&tag.as_str())
            })
        })
        .unwrap_or(false);

    // Find COD payment method
    let cod_method = input.payment_methods.iter()
        .find(|method| method.id == COD_PAYMENT_METHOD_ID);

    if let Some(cod) = cod_method {
        let mut hide_cod = false;
        let mut hide_message: Option<String> = None;

        // Check 1: City restriction
        if let Some(ref city) = shipping_city {
            if !ALLOWED_COD_CITIES.iter().any(|allowed| city.contains(&allowed.to_lowercase())) {
                hide_cod = true;
                hide_message = Some(format!(
                    "Cash on Delivery is not available for {}. Available cities: Riyadh, Jeddah, Dammam, and select major cities.",
                    input.purchase_proposal.delivery.address.as_ref().unwrap().city.as_ref().unwrap()
                ));
            }
        } else {
            // No city provided, hide COD
            hide_cod = true;
            hide_message = Some("Please provide a delivery address to see available payment methods.".to_string());
        }

        // Check 2: Order total restriction (100 SAR - 5000 SAR)
        if order_total < 100.0 {
            hide_cod = true;
            hide_message = Some("Cash on Delivery is only available for orders over 100 SAR.".to_string());
        } else if order_total > 5000.0 {
            hide_cod = true;
            hide_message = Some("Cash on Delivery is only available for orders up to 5,000 SAR. For larger orders, please use online payment.".to_string());
        }

        // Check 3: Customer blocked
        if is_customer_blocked {
            hide_cod = true;
            hide_message = Some("Cash on Delivery is not available for your account. Please use online payment methods.".to_string());
        }

        // Add hide operation if needed
        if hide_cod {
            operations.push(Operation {
                r#type: "hide".to_string(),
                hide: Some(HideOperation {
                    payment_method_id: cod.id.clone(),
                    message: hide_message,
                }),
                reorder: None,
            });
        }
    }

    // Reorder payment methods: Credit Card first, then BNPL, then COD (if visible)
    operations.push(Operation {
        r#type: "reorder".to_string(),
        hide: None,
        reorder: Some(ReorderOperation {
            payment_method_id: "shopify_payments".to_string(),
            index: 0,
        }),
    });

    operations
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_riyadh_cod_allowed() {
        let input = create_test_input("Riyadh", 500.0, vec![]);
        let operations = evaluate_payment_methods(&input);
        
        // Should NOT have hide operation for COD
        let hide_ops: Vec<_> = operations.iter()
            .filter(|op| op.r#type == "hide")
            .collect();
        assert!(hide_ops.is_empty());
    }

    #[test]
    fn test_remote_city_cod_blocked() {
        let input = create_test_input("Remote Village", 500.0, vec![]);
        let operations = evaluate_payment_methods(&input);
        
        // Should have hide operation for COD
        let hide_ops: Vec<_> = operations.iter()
            .filter(|op| op.r#type == "hide")
            .collect();
        assert!(!hide_ops.is_empty());
    }

    #[test]
    fn test_small_order_cod_blocked() {
        let input = create_test_input("Riyadh", 50.0, vec![]);
        let operations = evaluate_payment_methods(&input);
        
        let hide_ops: Vec<_> = operations.iter()
            .filter(|op| op.r#type == "hide")
            .collect();
        assert!(!hide_ops.is_empty());
    }

    fn create_test_input(city: &str, total: f64, customer_tags: Vec<String>) -> Input {
        Input {
            purchase_proposal: PurchaseProposal {
                delivery: Delivery {
                    address: Some(Address {
                        city: Some(city.to_string()),
                        province_code: None,
                        country_code: "SA".to_string(),
                    }),
                },
                totals: Totals {
                    total_price: Price {
                        amount: total.to_string(),
                        currency_code: "SAR".to_string(),
                    },
                },
                buyer_identity: Some(BuyerIdentity {
                    customer: Some(Customer {
                        id: "gid://shopify/Customer/123".to_string(),
                        tags: customer_tags,
                    }),
                }),
            },
            payment_methods: vec![
                PaymentMethod {
                    id: COD_PAYMENT_METHOD_ID.to_string(),
                    name: "Cash on Delivery".to_string(),
                },
            ],
        }
    }
}
