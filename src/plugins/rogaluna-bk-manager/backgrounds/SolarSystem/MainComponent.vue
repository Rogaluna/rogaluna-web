<template>
    <div class="background">
        <section id="solar-system">
        <div id="sun"></div>
        <article id="mercury-trajectory">
            <div id="mercury"></div>
        </article>
        <article id="venus-trajectory">
            <div id="venus"></div>
        </article>
        <article id="earth-trajectory">
            <div id="earth"></div>
        </article>
        <article id="mars-trajectory">
            <div id="mars"></div>
        </article>
        <!-- too far for my starship 🪐🚀 -->
        <!-- <article id="main-asteroid-belt-trajectory"></article> -->
        <!-- <article id="jupiter-trajectory"></article> -->
        <!-- <article id="saturn-trajectory"></article> -->
        <!-- <article id="uranus-trajectory"></article -->
        <!-- <article id="neptune-trajectory"></article> -->
        </section>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
@import "./css/style.css";

.background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

</style>