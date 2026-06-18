<script setup>

defineProps({
    direction: {
        type: String,
        required: true
    }
})

</script>

<template>

<button class="nav-button">

    <svg
        viewBox="0 0 24 24"
        :class="[
                'arrow-icon',
                direction === 'left'
                    ? 'arrow-left'
                    : 'arrow-right'
        ]">

        <path
            :d="direction === 'left'
                ? 'M15 18L9 12L15 6'
                : 'M9 18L15 12L9 6'"

            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>

</button>

</template>

<style scoped>

.nav-button {
    position: absolute;
    width: 42px;
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: rgba(255,255,255,0.65);
    color: #444;
    cursor: pointer;
    transition: background 0.2s;
}

.nav-button:hover {
    background: rgba(255,255,255,0.9);
}

.arrow-icon {
    width: 40px;
    height: 40px;
}

.arrow-left {
    transform: translateX(-2px);
}

.arrow-right {
    transform: translateX(2px);
}

</style>