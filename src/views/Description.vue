<template>
    <div class="description">
        <span>{{ description }}</span>
    </div>
    <!-- <div class="skill-area">
        <div class="aktive">
            <div class="a-name">{{ aktiveName }} <br> <span>&lt;aktive&gt;</span></div>
            <div class="a-des"></div>
        </div>
        <div class="passive">
            <div class="p-name">{{ passiveName }} <br> <span>&lt;passive&gt;</span></div>
            <div class="p-des"></div>
        </div>
    </div> -->
</template>

<style>
* {
    margin: 0;
  padding: 0;
}
.description {
    background-image: url(../assets/card/text-background.png);
    background-repeat: round ;
    max-height: 300px;
    max-width: 300px;
    color: aliceblue;
}
</style>

<script>
export default {
    data :() => ({
        description:"Here is something about this card that must be clar."
    })
}
</script>