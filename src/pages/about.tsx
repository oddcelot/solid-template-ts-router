import { createEffect, Suspense } from 'solid-js'
import { RouteSectionProps } from '@solidjs/router'
import type { AboutDataType } from './about.data'

export default function About(
    props: RouteSectionProps<ReturnType<AboutDataType>>
) {
    const name = props.data

    createEffect(() => {
        console.log(name())
    })

    return (
        <>
            <h1>About</h1>

            <p>A page all about this website.</p>

            <section>
                <span>We love</span>
                <Suspense fallback={<span>...</span>}>
                    <span>&nbsp;{name()}</span>
                </Suspense>
            </section>
        </>
    )
}
