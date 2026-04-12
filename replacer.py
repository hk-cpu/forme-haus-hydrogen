import sys

with open('app/components/EditorialSection.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target1 = """            className="w-full h-full object-cover block transition-transform duration-700 ease-out"
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              transformOrigin: 'center center',
              willChange: 'transform',
            }}"""

repl1 = """            className={`w-full h-full object-cover block transition-transform duration-700 ease-out ${shouldReduceMotion ? '' : 'kenBurns'}`}
            style={{
              animationPlayState: isHovered ? 'paused' : 'running',
              transformOrigin: 'center center',
              willChange: 'transform',
            }}"""

target2 = """            <motion.div
              className="mt-2 h-[1px] bg-[#D4AF87]"
              initial={{width: 24}}
              animate={{width: isHovered ? 40 : 24}}
              transition={{duration: 0.4, ease: [0.16, 1, 0.3, 1]}}
            />
          </motion.div>"""

repl2 = """            <motion.div
              className="mt-2 h-[1px] bg-[#D4AF87]"
              initial={{width: 24}}
              animate={{width: isHovered ? 40 : 24}}
              transition={{duration: 0.4, ease: [0.16, 1, 0.3, 1]}}
            />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] uppercase tracking-[0.2em] text-[#D4AF87] mt-3 inline-flex items-center gap-1">
              Shop the Edit &rarr;
            </span>
          </motion.div>"""

# Normalizing line endings for consistent replace
text = text.replace('\r\n', '\n')
target1 = target1.replace('\r\n', '\n')
repl1 = repl1.replace('\r\n', '\n')
target2 = target2.replace('\r\n', '\n')
repl2 = repl2.replace('\r\n', '\n')

text = text.replace(target1, repl1)
text = text.replace(target2, repl2)

with open('app/components/EditorialSection.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(text)

print('Replacements done.')
