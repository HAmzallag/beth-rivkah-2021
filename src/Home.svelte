<script lang="ts">

    import {onMount} from "svelte";
    import {api} from "./utils/api";
    import type {Donation} from "./interfaces/Donation";
    import DonationDefiler from "./DonationDefiler.svelte";

    const url: any = new URL('https://dwcaas.stackhero-network.com/.well-known/mercure');
    url.searchParams.append('topic', 'https://gala2021.bethrivkah.fr/public/index.php/api/donations/{id}');

    let dons: Donation[] = [];
    let nbDons: number = 0;
    let lastDon: any = null;
    let loading: boolean = true;
    let desktopImg ="/imgs/background.jpg";
    let mobileImg ="/imgs/bandeau-mobile.png";

    let ytPlayer;
    let bandeau;
    let background;
    let fullName;
    let flamme;
    let flammeLogo;
    let button;
    let marquee;

    let i = 0;
    let speed = 50;
    let txt = "";


    function truncate(str: string, length: number, ending: string = ""){
        if(str.length > length){
            let substr = str.substring(0, length);
            return substr + ending;
        }else{
            return str;
        }
    }

    function getDonations() {
        return api(`/api/donations`)
            .then(({data}) => {
                dons = data["hydra:member"];
                nbDons = data["hydra:totalItems"];
                lastDon = dons[0];
                loading = false;
            })
    }

    onMount(() =>
        {
            getDonations();
            execMercure();
            window.addEventListener('resize', resize);
            window.addEventListener('DOMContentLoaded', resize);
            window.addEventListener('orientationchange', () => {
                    location.reload();
                }
            );
        }
    )

    $: {
        if(!loading && fullName !== undefined && marquee !== undefined && flammeLogo !== undefined){
            resize();
            flammeLogo.style.opacity = nbDons / 3000;
        }
    }

    function execMercure()
    {
        let eventSource = new EventSource(url);
        // The callback will be called every time an update is published
        eventSource.onmessage = function ({data}) {
            lastDon = JSON.parse(data);
            nbDons += 1;
            dons.unshift(data);
            console.log("push", lastDon);
        };

    }

    function resize(){
        // nameLine.style.width = fullName.getBoundingClientRect().width+'px';
        if(innerWidth > 1380){
            ytPlayer.style.height = innerHeight - bandeau.getBoundingClientRect().height+'px';
            ytPlayer.style.width = ytPlayer.getBoundingClientRect().height*1.7777+'px';
        }
        else if(innerWidth <= 1380){
            ytPlayer.style.width =innerWidth+'px';
            ytPlayer.style.height =innerWidth/1.7777+'px';
        }

        let imgURL = desktopImg;
        fullName.style.top = innerWidth / 80+'px';
        fullName.style.left = innerWidth / 2.38+'px';
        // nameLine.style.top = innerWidth / 22+'px';
        // nameLine.style.left = innerWidth / 2.38+'px';
        flamme.style.top = innerWidth / 65+'px';
        flamme.style.left = innerWidth / 1.24+'px';
        flammeLogo.style.top = innerWidth / 90+'px';
        flammeLogo.style.left = innerWidth / 1.315+'px';
        button.style.top = innerWidth / 25+'px';
        button.style.left = innerWidth / 45+'px';
        marquee.style.top = innerWidth / 14.5+'px';
        if(innerWidth <= 640){
            imgURL = mobileImg;
            fullName.style.top = innerWidth / 8+'px';
            fullName.style.left = innerWidth / 4+'px';
            // nameLine.style.top = innerWidth / 5+'px';
            // nameLine.style.left = innerWidth / 4+'px';
            flamme.style.top = innerWidth / 3.7+'px';
            flamme.style.left = innerWidth / 4.75+'px';
            flammeLogo.style.top = innerWidth / 3.9+'px';
            flammeLogo.style.left = innerWidth / 9+'px';
            button.style.top = innerWidth / 3.4+'px';
            button.style.left = innerWidth / 1.71+'px';
            marquee.style.top = innerWidth / 1.95+'px';
        }
        background.src = imgURL;
    }


</script>

<div id="content">
    <iframe id="ytPlayer"
            frameborder="0"
            scrolling="no"
            marginheight="0"
            marginwidth="0"
            bind:this={ytPlayer}
            src="https://www.youtube.com/embed/43gouK9Cd74"
            allowfullscreen
    >
    </iframe>


    <div id="bandeau" bind:this={bandeau}>
        <span class="texts svelte-bti8of" bind:this={fullName}>
            {#if lastDon}
                 {truncate(lastDon.fullName, 21, "..") + " - " + lastDon.euroAmount + " €"}
             {/if}
        </span>
        <!-- <div class="nameLine"></div> -->
        <div id="flammeLogo"
             bind:this={flammeLogo}>
        </div>
        <div class="texts svelte-4m28l7"
             bind:this={flamme}
        >
            {#if !loading}
                {nbDons}
            {/if}
        </div>
        <div id="button"
             bind:this={button}
        >
            <a target="_blank" href="https://www.soutien.bethrivkah.fr">
                <img src="/imgs/soutien-btn.png">
            </a>
        </div>
        <div class="texts svelte-lueg8e"
             bind:this={marquee}>
            <div class="marquee">
                {#if !loading}
                    <span>
                        <DonationDefiler donations={dons} />
                    </span>
                {/if}
            </div>
        </div>

        <img
                bind:this={background}
                class="background"
                src=""
        >
    </div>
</div>


<style>

    *{
        margin: 0;
        padding: 0;
    }
    #content {
        margin: 0 auto;
        text-align: center;
    }
    #ytPlayer {
        width: 100vw;
        max-width: 1380px;
        height: calc(100vw / 1.777);
        aspect-ratio: 16 / 9;
    }
    #bandeau {
        overflow: hidden;
        background: #031032;
        position: absolute;
        bottom: 0;
        width: 100vw;
        height: auto;
        max-width: 1920px;
        max-height: auto;
        font-family: BlinkMacSystemFont,-apple-system,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
    }
    #button {
        position: absolute;
        width: 13vw;
    }
    #button img{
        width: 100%;
    }
    .texts {
        position: absolute;
        color: white;
        text-align: center;
    }
    #bandeau .background{
        width: 100vw;
        height: auto;
    }
    #flammeLogo{
        position: absolute;
        width: 2.5vw;
        height: 96px;
        background-image: url("/imgs/flamme.png");
        background-repeat: no-repeat;
        background-size: contain;
        opacity: 0.5;
    }
    .svelte-bti8of {
        font-size: 2.0vw;
        padding-top: 0.6vw;
    }
    .nameLine {
        position: absolute;
        height: 2px;
        background: white;
    }
    .svelte-4m28l7 {
        font-size: 1.6vw;
    }
    .svelte-lueg8e{
        width: 90vw;
    }
    .svelte-lueg8e span{
        width: 90vw;
        font-size: 1.6vw;
    }

    .marquee {
        height: 1.7vw;
        overflow: hidden;
        position: relative;
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
        -moz-animation: scroll-left 800s linear infinite;
        -webkit-animation: scroll-left 800s linear infinite;
        animation: scroll-left 800s linear infinite;
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
        .svelte-bti8of {
            font-size: 5vw;
        }
        .svelte-4m28l7 {
            font-size: 5vw;
        }
        .svelte-lueg8e{
            width: 100vw;
        }
        #flammeLogo{
            position: absolute;
            width: 7vw;
            height: 96px;
        }
        #button {
            width: 35vw;
        }
        .svelte-lueg8e span{
            font-size: 3vw;
        }
        .marquee {
            height: 3.7vw;
        }
    }
</style>