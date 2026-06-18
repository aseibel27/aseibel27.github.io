<script setup>

const props = defineProps({

    src: {
        type: String,
        required: true
    },

    caption: {
        type: String,
        default: ""
    },

    outline: {
        type: Boolean,
        default: false
    }

})

</script>

<template>

<div class="figure-container">

    <div 
    class="image-wrapper"
    :class="{ outlined: outline }"
    >

        <img
            class="figure-image"
            :src="src"
        >

        <div
            v-if="caption"
            class="caption">

            {{ caption }}

        </div>

    </div>

</div>

</template>

<style scoped>

.figure-container {
    display: flex;
    justify-content: center;
    align-items: center;

    margin: 2rem auto;
    max-width: 700px;
}

.image-wrapper {
    position: relative;
    display: inline-block;
    overflow: hidden;
    border-radius: 8px;
}

.figure-image {
    width: 100%;
    max-width: 700px;
    max-height: 400px;
    object-fit: contain;
    display: block;
}

.caption {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    min-height: 15%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.75rem 1.5rem;
    background: rgba(255,255,255,0.65);
    color: black;
    text-align: center;
    font-size: 0.95rem;
}

.outlined {
    border: 2px solid var(--vp-c-divider);
}

</style>