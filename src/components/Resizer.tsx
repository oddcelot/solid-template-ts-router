import { JSX, ParentComponent, mergeProps, onCleanup, onMount } from 'solid-js'
import { createStore } from 'solid-js/store'
import style from './Resizer.module.css'

export type ResizerProps = {
    direction: 'horizontal' | 'vertical'
    target?: HTMLElement
    class?: JSX.HTMLAttributes<HTMLDivElement>['class']
    classList?: JSX.HTMLAttributes<HTMLDivElement>['classList']
    onResizeStart?: () => void
    onResizeEnd?: () => void
}

export const Resizer: ParentComponent<ResizerProps> = (initialProps) => {
    const props = mergeProps<(typeof initialProps)[]>(initialProps)
    let resizerElement: HTMLDivElement
    let target = props.target

    const [state, setState] = createStore({
        resizing: false,
        pos: {
            start: { x: 0, y: 0 },
            current: { x: 0, y: 0 },
        },
    })

    const removeTracking = (ev: MouseEvent) => {
        setState('resizing', false)
        props.onResizeEnd?.()
    }

    const trackSize = (ev: MouseEvent) => {
        if (state.resizing) {
            setState('pos', 'current', { x: ev.clientX, y: ev.clientY })

            if (props.direction === 'horizontal') {
                target.style.width = `${
                    target.getBoundingClientRect().width - ev.movementX
                }px`
            }
            if (props.direction === 'vertical') {
                target.style.height = `${
                    target.getBoundingClientRect().height - ev.movementY
                }px`
            }
        }
    }

    onMount(() => {
        addEventListener('mouseup', removeTracking)
        addEventListener('mousemove', trackSize)

        target = props.target || resizerElement?.parentElement
    })

    onCleanup(() => {
        removeEventListener('mouseup', removeTracking)
        removeEventListener('mousemove', trackSize)
    })

    return (
        <div
            ref={resizerElement}
            onMouseDown={(ev) => {
                ev.preventDefault()
                setState('resizing', true)
                setState('pos', 'start', { x: ev.clientX, y: ev.clientY })
                props.onResizeStart?.()
            }}
            class={[style.Resizer, props.class].join(' ')}
            classList={props.classList}
            data-resizing={state.resizing}
            data-direction={props.direction}
        >
            {props.children}
        </div>
    )
}

export default Resizer
