import { useEffect, useRef } from "react"

export default function Cursor() {
  const bigRef = useRef<HTMLDivElement | null>(null)
  const smallRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const big = bigRef.current!
    const small = smallRef.current!
    let raf = 0

    const target = { x: -100, y: -100 }
    const bigPos = { x: -100, y: -100, scale: 1 }
    const smallPos = { x: -100, y: -100 }

    const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b

    function update() {
      // small dot tracks the pointer almost instantly (tight, responsive)
      smallPos.x = lerp(smallPos.x, target.x, 0.9)
      smallPos.y = lerp(smallPos.y, target.y, 0.9)

      // ring follows with a fast, smooth trail for a premium feel
      bigPos.x = lerp(bigPos.x, target.x, 0.4)
      bigPos.y = lerp(bigPos.y, target.y, 0.4)
      const targetScale = parseFloat(big.dataset.scale ?? "1")
      bigPos.scale = lerp(bigPos.scale, targetScale, 0.2)

      if (big) {
        big.style.transform = `translate3d(${bigPos.x}px, ${bigPos.y}px, 0) scale(${bigPos.scale})`
      }
      if (small) {
        small.style.transform = `translate3d(${smallPos.x}px, ${smallPos.y}px, 0)`
      }

      raf = requestAnimationFrame(update)
    }

    function onMove(e: MouseEvent) {
      target.x = e.clientX
      target.y = e.clientY
    }

    function onHover() {
      if (big) big.dataset.scale = "4"
    }
    function onHoverOut() {
      if (big) big.dataset.scale = "1"
    }

    document.addEventListener("mousemove", onMove)

    // apply hover effect to any interactive element
    const interactiveSelector =
      'a[href], button, input, textarea, select, [role="button"], [onclick], [data-action], .hoverable, [tabindex]:not([tabindex="-1"])'

    const onPointerOver = (e: PointerEvent) => {
      const el = (e.target as Element).closest(interactiveSelector)
      if (el) onHover()
    }

    const onPointerOut = (e: PointerEvent) => {
      const el = (e.target as Element).closest(interactiveSelector)
      if (el) onHoverOut()
    }

    const onFocusIn = (e: FocusEvent) => {
      const el = (e.target as Element).closest(interactiveSelector)
      if (el) onHover()
    }

    const onFocusOut = (e: FocusEvent) => {
      const el = (e.target as Element).closest(interactiveSelector)
      if (el) onHoverOut()
    }

    document.addEventListener("pointerover", onPointerOver)
    document.addEventListener("pointerout", onPointerOut)
    document.addEventListener("focusin", onFocusIn)
    document.addEventListener("focusout", onFocusOut)

    raf = requestAnimationFrame(update)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("pointerover", onPointerOver)
      document.removeEventListener("pointerout", onPointerOut)
      document.removeEventListener("focusin", onFocusIn)
      document.removeEventListener("focusout", onFocusOut)
    }
  }, [])

  return (
    <div className="cursor" aria-hidden>
      <div ref={bigRef} data-scale="1" className="cursor__ball cursor__ball--big" />
      <div ref={smallRef} className="cursor__ball cursor__ball--small" />
    </div>
  )
}
