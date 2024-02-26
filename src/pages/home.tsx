import { createSignal } from 'solid-js'

export default function Home() {
    const [count, setCount] = createSignal(0)

    return (
        <>
            <h1>Home</h1>
            <p>This is the home page.</p>

            <div class="flex items-center space-x-2">
                <button
                    class="aspect-square"
                    onClick={() => setCount(count() - 1)}
                >
                    -
                </button>

                <output class="p-2">Count: {count()}</output>

                <button
                    class=" aspect-square"
                    onClick={() => setCount(count() + 1)}
                >
                    +
                </button>
            </div>
        </>
    )
}
