import { animated, useSpring, useTransition } from "@react-spring/web"

const Test = () => {

    const transitions = useTransition([1,2,3], {
        from: ({x}) => ({x: 10}),
        enter: ({x}) => ({x: 100}),
    })

    return <>
            <div
            style={{
                backgroundColor: "rgb(200, 200, 250)",
                width: "100%",
                height: "100%",
                aspectRatio: "1/1",
            }}
            >
                {transitions((style, item) => (
                    <animated.div style={{
                        backgroundColor: "rgb(200, 0, 0)",
                        ...style,
                    }}>
                        {item}
                    </animated.div>
                ))}
            </div>
    </>
}

export default Test