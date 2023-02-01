<template>
    <div class="description">
        <span>{{ description }}</span>
    </div>
</template>

<style>
* {
    margin: 0;
  padding: 0;
}
.description {
    background-image: url(../assets/card/text/text-background.png);
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