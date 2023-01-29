<template>
    <div class="skill-area">
        <div class="aktive">
            <div class="a-name">{{ aktiveName }} <br> <span>&lt;aktive&gt;</span></div>
            <div class="a-des"></div>
        </div>
        <div class="passive">
            <div class="p-name">{{ passiveName }} <br> <span>&lt;passive&gt;</span></div>
            <div class="p-des"></div>
        </div>
    </div>
</template>

<style>
* {
    margin: 0;
  padding: 0;
}
.skill-area {
    width:auto;
    height: auto;
    background-image: url(../assets/card/text-background.png);
}
.a-name  {
    width:50px;
    height: 25px;
    background-image: url(../assets/card/skill-background.png);
}
/* .a-des .p-des {
    
} */
</style>

<script>
export default {
    data :() => ({
        aktiveName : "aktive skill",
        passiveName : "passive skill"
    })
}
</script>