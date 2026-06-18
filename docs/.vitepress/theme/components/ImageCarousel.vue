<script setup>
import { ref } from 'vue'
import FigureImage from './FigureImage.vue'
import ArrowButton from './ArrowButton.vue'

const props = defineProps({
    images: {
        type: Array,
        required: true
    }
})

const current = ref(0)

function next() {
    current.value =
        (current.value + 1) % props.images.length
}

function previous() {
    current.value =
        (current.value - 1 + props.images.length)
        % props.images.length
}
</script>

<template>

<div class="carousel">

    <div class="carousel-container">

        <FigureImage
            :src="images[current].src"
            :caption="images[current].caption"
            :outline="images[current].outline"
        />

        <ArrowButton
            class="left-side-button"
            direction="left"
            @click="previous"
        />

        <ArrowButton
            class="right-side-button"
            direction="right"
            @click="next"
        />

    </div>

    <div class="image-number">

        {{ current + 1 }} / {{ images.length }}

    </div>

</div>

</template>

<style scoped>

.carousel {
    margin: 2rem auto;
    max-width: 700px;
}

.carousel-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.left-side-button {
    left: 15px;
}

.right-side-button {
    right: 15px;
}

.image-number {
    margin-top: 1rem;
    text-align: center;
    color: gray;
    font-size: 0.9rem;
}

</style>