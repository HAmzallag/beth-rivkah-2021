<script lang="ts">
    import type {Donation} from "./interfaces/Donation";
    import {onMount} from "svelte";

    export let donations: Donation[] = [];
    let marquee = null;
    let textDefilant = "";
    let speed = 800;

    function resize(){
        marquee.style.top = innerWidth / 14.5+'px';
        if(innerWidth <= 640){
            marquee.style.top = innerWidth / 1.95+'px';
        }
    }

    onMount(()=> {
        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('DOMContentLoaded', resize);
    });

    $: {
        if(donations.length > 0){
            donations.map( function( don: Donation ){
                 textDefilant += don.fullName + ": " + don.originalAmount + don.originalCurrency +" - ";
            });
        }
        speed = textDefilant.length / 12.5;
    }
</script>



<div class="texts svelte-lueg8e" bind:this={marquee}>
    <div class="marquee">
        <span style="--speed: {speed}s">
            {textDefilant}
        </span>
    </div>
</div>

<style>
    .svelte-lueg8e{
        width: 100vw;
    }

    .svelte-lueg8e span{
        width: 90vw;
        font-size: 1.6vw;
    }

    .marquee {
        height: 1.8vw;
        overflow: hidden;
        position: relative;
        padding-top: 0.4vw;
    }

    .marquee span {
        position: absolute;
        overflow: hidden;
        width: auto;
        height: 100%;
        margin: 0;
        line-height: 80%;
        text-align: left;
        white-space: nowrap;
        -moz-transform: translateX(0%);
        -webkit-transform: translateX(0%);
        transform: translateX(0%);
        -moz-animation: scroll-left var(--speed) linear infinite;
        -webkit-animation: scroll-left var(--speed) linear infinite;
        animation: scroll-left var(--speed) linear infinite;
    }
    .texts {
        position: absolute;
        color: white;
        text-align: center;
    }

    @-webkit-keyframes scroll-left {
        0% {
            -webkit-transform: translateX(0%);
        }
        100% {
            -webkit-transform: translateX(-100%);
        }
    }

    @keyframes scroll-left {
        0% {
            -moz-transform: translateX(0%);
            -webkit-transform: translateX(0%);
            transform: translateX(0%);
        }
        100% {
            -moz-transform: translateX(-100%);
            -webkit-transform: translateX(-100%);
            transform: translateX(-100%);
        }
    }

    @media only screen and (max-width: 640px) {
        .svelte-lueg8e span {
            font-size: 3vw;
        }

        .marquee {
            height: 3.7vw;
        }
    }
</style>

