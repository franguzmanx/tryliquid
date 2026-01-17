import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

function formatCurrency(n, currencySymbol = "$") {
    const rounded = Math.round(n)
    return (
        currencySymbol +
        rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    )
}

export default function LeverageScrollProgress(props) {
    const {
        baseAmount = 100,
        maxAmount = 5000,
        currencySymbol = "$",
        minLeverage = 1,
        maxLeverage = 50,
        titlePrefix = "Your",
        titleMiddle = "becomes",
        titleSize = 64,
        scrollHeight = 300,
        backgroundColor = "#FFFFFF",
    } = props

    const containerRef = React.useRef(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    const leverage = useTransform(scrollYProgress, [0, 1], [minLeverage, maxLeverage])

    const amount = useTransform(leverage, (lev) => {
        const t = Math.max(0, Math.min(1, (lev - minLeverage) / (maxLeverage - minLeverage)))
        return baseAmount + t * (maxAmount - baseAmount)
    })

    const [amountText, setAmountText] = React.useState(formatCurrency(baseAmount, currencySymbol))
    const [leverageText, setLeverageText] = React.useState(`${minLeverage}x`)

    React.useEffect(() => {
        const unsubAmount = amount.on("change", (v) => {
            setAmountText(formatCurrency(v, currencySymbol))
        })
        const unsubLeverage = leverage.on("change", (v) => {
            setLeverageText(`${Math.round(v)}x`)
        })
        return () => {
            unsubAmount()
            unsubLeverage()
        }
    }, [amount, leverage, currencySymbol])

    const baseText = formatCurrency(baseAmount, currencySymbol)

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: `${scrollHeight}vh`,
                position: "relative",
            }}
        >
            {/* Fixed content that stays in view */}
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100vh",
                    background: backgroundColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: 900,
                        padding: 48,
                        boxSizing: "border-box",
                        display: "flex",
                        flexDirection: "column",
                        gap: 32,
                        alignItems: "center",
                        fontFamily:
                            'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
                    }}
                >
                    {/* Two-line title */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        {/* Top line */}
                        <div
                            style={{
                                fontSize: titleSize,
                                lineHeight: 1.06,
                                fontWeight: 600,
                                letterSpacing: "-0.07em",
                                textAlign: "center",
                                fontVariantNumeric: "tabular-nums",
                                WebkitFontSmoothing: "antialiased",
                                whiteSpace: "nowrap",
                                opacity: 1,
                                color: "#000",
                            }}
                        >
                            With leverage,
                        </div>

                        {/* Bottom line */}
                        <div
                            style={{
                                fontSize: titleSize,
                                lineHeight: 1.06,
                                fontWeight: 600,
                                letterSpacing: "-0.07em",
                                textAlign: "center",
                                fontVariantNumeric: "tabular-nums",
                                WebkitFontSmoothing: "antialiased",
                                whiteSpace: "nowrap",
                            }}
                        >
                            <span style={{ opacity: 0.5, color: "#000" }}>{titlePrefix} </span>
                            <span style={{ opacity: 1, color: "#000" }}>{baseText} </span>
                            <span style={{ opacity: 0.5, color: "#000" }}>{titleMiddle} </span>
                            <motion.span
                                style={{
                                    opacity: 1,
                                    color: "#000",
                                    display: "inline-block",
                                    minWidth: "4ch",
                                }}
                            >
                                {amountText}
                            </motion.span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

addPropertyControls(LeverageScrollProgress, {
    baseAmount: {
        type: ControlType.Number,
        title: "Base Amount",
        defaultValue: 100,
    },
    maxAmount: {
        type: ControlType.Number,
        title: "Max Amount",
        defaultValue: 5000,
    },
    currencySymbol: {
        type: ControlType.String,
        title: "Currency",
        defaultValue: "$",
    },
    minLeverage: {
        type: ControlType.Number,
        title: "Min Leverage",
        defaultValue: 1,
    },
    maxLeverage: {
        type: ControlType.Number,
        title: "Max Leverage",
        defaultValue: 50,
    },
    titlePrefix: {
        type: ControlType.String,
        title: "Prefix",
        defaultValue: "Your",
    },
    titleMiddle: {
        type: ControlType.String,
        title: "Middle",
        defaultValue: "becomes",
    },
    titleSize: {
        type: ControlType.Number,
        title: "Title Size",
        defaultValue: 64,
    },
    scrollHeight: {
        type: ControlType.Number,
        title: "Scroll Height (vh)",
        defaultValue: 300,
        min: 100,
        max: 1000,
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#FFFFFF",
    },
})
