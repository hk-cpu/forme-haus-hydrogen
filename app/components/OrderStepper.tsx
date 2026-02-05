import clsx from 'clsx';
import { type FulfillmentStatus } from '@shopify/hydrogen/customer-account-api-types';

export function OrderStepper({ status }: { status: FulfillmentStatus }) {
    // Map fulfillment status to stepper steps
    // Logic: 
    // OPEN/UNFULFILLED -> Step 1 (Order Placed) Active / Step 2 Pending
    // IN_PROGRESS -> Step 1 Complete / Step 2 Processing Active
    // FULFILLED/SUCCESS -> Step 1, 2 Complete / Step 3 Shipping/Delivered Active

    const steps = [
        { title: 'Order Placed', status: 'Completed', date: 'Confirmed' },
        { title: 'Processing', status: 'In Progress', date: 'Preparing' },
        { title: 'Shipping', status: 'Pending', date: 'Estimated 3-5 Days' },
    ];

    let activeStep = 0; // 0-indexed
    if (status === 'IN_PROGRESS') activeStep = 1;
    if (status === 'FULFILLED' || status === 'SUCCESS') activeStep = 2;

    // @todo: Refine this logic based on actual Shopify statuses (OPEN, FULFILLED, etc.)

    return (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-8 w-full max-w-md shadow-sm border border-[#a87441]/10">
            <div className="flex flex-col gap-0">
                {steps.map((step, index) => {
                    const isCompleted = index < activeStep;
                    const isActive = index === activeStep;
                    const isPending = index > activeStep;

                    return (
                        <div key={step.title} className="flex relative items-start group">
                            {/* Vertical Line */}
                            {index !== steps.length - 1 && (
                                <div
                                    className={clsx(
                                        "absolute left-[19px] top-10 bottom-0 w-0.5 z-0",
                                        isCompleted ? "bg-[#1E1E1E] dark:bg-[#F0EAE6]" : "bg-[#e2e8f0] dark:bg-white/10"
                                    )}
                                    style={{ height: 'calc(100% - 10px)' }}
                                />
                            )}

                            {/* Circle Icon */}
                            <div
                                className={clsx(
                                    "w-10 h-10 rounded-full flex items-center justify-center mr-4 z-10 shrink-0 transition-colors duration-300",
                                    isCompleted && "bg-[#1E1E1E] dark:bg-[#F0EAE6] text-white dark:text-[#1E1E1E]",
                                    isActive && "border-2 border-[#1E1E1E] dark:border-[#F0EAE6] text-[#1E1E1E] dark:text-[#F0EAE6]",
                                    isPending && "border-2 border-[#e2e8f0] dark:border-white/20 text-[#94a3b8] dark:text-white/30"
                                )}
                            >
                                {isCompleted ? (
                                    <svg viewBox="0 0 16 16" fill="currentColor" height={16} width={16} xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                                    </svg>
                                ) : (
                                    <span className="text-sm font-medium">{index + 1}</span>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-8 group-last:pb-0">
                                <div className={clsx("font-semibold mb-1", isPending ? "text-gray-400 dark:text-white/40" : "text-[#1E1E1E] dark:text-[#F0EAE6]")}>
                                    {step.title}
                                </div>
                                <div
                                    className={clsx(
                                        "text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full inline-block font-medium mb-1",
                                        isCompleted ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                                            isActive ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
                                                "bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400"
                                    )}
                                >
                                    {isCompleted ? 'Completed' : isActive ? 'In Progress' : 'Pending'}
                                </div>
                                {step.date && (
                                    <div className="text-xs text-gray-400 dark:text-white/30 mt-1">{step.date}</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
