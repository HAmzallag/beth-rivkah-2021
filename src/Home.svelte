<script lang="ts">

    import {onMount} from "svelte";
    import {api} from "./utils/api";
    import type {Donation} from "./interfaces/Donation";
    import DonationDefiler from "./DonationDefiler.svelte";

    const url: any = new URL('https://dwcaas.stackhero-network.com/.well-known/mercure');
    //@ts-ignore
    url.searchParams.append('topic', appEnv.env.API_URL + 'api/donations/{id}');

    let dons: Donation[] = [];
    let nbDons: number = 0;
    let lastDon: any = null;
    let youtubeLink: string = "";
    let loading: boolean = true;
    let desktopImg ="/imgs/background.jpg";
    let mobileImg ="/imgs/bandeau-mobile.png";

    let header;
    let ytPlayer;
    let bandeau;
    let background;
    let fullName;
    let flamme;
    let flammeLogo;
    let button;


    function truncate(str: string, length: number, ending: string = ""){
        if(str.length > length){
            let substr = str.substring(0, length);
            return substr + ending;
        }else{
            return str;
        }
    }

    function getContents() {
        return api(`/api/contents?code=youtubelive2021`)
            .then(({data}) => {
                youtubeLink = data["hydra:member"][0].content;
            })
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
            getContents();
            getDonations();
            execMercure();
            window.addEventListener('resize', resize);
            window.addEventListener('DOMContentLoaded', resize);
            window.addEventListener('orientationchange', () => {location.reload(); });
        }
    )

    $: {
        if(!loading && fullName !== undefined && flammeLogo !== undefined){
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
        header.style.display = "none";

        if(innerWidth > 1380){
            ytPlayer.style.height = innerHeight - bandeau.getBoundingClientRect().height+'px';
            ytPlayer.style.width = ytPlayer.getBoundingClientRect().height*1.7777+'px';
        }
        else if(innerWidth <= 1380 && innerWidth > 640){
            if(innerHeight < innerWidth){
                 ytPlayer.style.height = innerHeight - bandeau.getBoundingClientRect().height+'px';
                 ytPlayer.style.width = ytPlayer.getBoundingClientRect().height*1.7777+'px';
                if(ytPlayer.getBoundingClientRect().height*1.7777 > innerWidth){
                    ytPlayer.style.width =innerWidth+'px';
                    ytPlayer.style.height =innerWidth/1.7777+'px';
                }
            }else{
                header.style.display = "block";
                ytPlayer.style.width =innerWidth+'px';
                ytPlayer.style.height =innerWidth/1.7777+'px';
            }
        }
        else if(innerWidth <= 640){
            ytPlayer.style.width =innerWidth+'px';
            ytPlayer.style.height =innerWidth/1.7777+'px';
        }

        let imgURL = desktopImg;
        fullName.style.top = innerWidth / 80+'px';
        fullName.style.left = innerWidth / 2.38+'px';
        flamme.style.top = innerWidth / 65+'px';
        flamme.style.left = innerWidth / 1.25+'px';
        flammeLogo.style.top = innerWidth / 90+'px';
        flammeLogo.style.left = innerWidth / 1.315+'px';
        button.style.top = innerWidth / 25+'px';
        button.style.left = innerWidth / 45+'px';
        if(innerWidth <= 640 ){
            if(innerHeight > 600){
                header.style.display = "block";
            }
            imgURL = mobileImg;
            fullName.style.top = innerWidth / 8+'px';
            fullName.style.left = innerWidth / 4+'px';
            flamme.style.top = innerWidth / 3.7+'px';
            flamme.style.left = innerWidth / 5+'px';
            flammeLogo.style.top = innerWidth / 3.9+'px';
            flammeLogo.style.left = innerWidth / 9+'px';
            button.style.top = innerWidth / 3.4+'px';
            button.style.left = innerWidth / 1.71+'px';
        }
        background.src = imgURL;
    }

</script>

<div id="content">

    <img src="/imgs/header-mobile-portrait.png" class="header" bind:this={header}>


    <iframe id="ytPlayer"
            frameborder="0"
            scrolling="no"
            marginheight="0"
            marginwidth="0"
            bind:this={ytPlayer}
            src={youtubeLink}
            allowfullscreen
    >
    </iframe>
    <div id="bandeau" bind:this={bandeau}>
        <span class="texts svelte-bti8of" bind:this={fullName}>
            {#if lastDon}
                 {truncate(lastDon.fullName, 17, "..") + " - " + lastDon.euroAmount + " €"}
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

        <DonationDefiler donations={dons} />

        <img
                bind:this={background}
                class="background"
                src=""
        >
    </div>

</div>
<a id="footer" href="mailto:gilles@macsimedia.com">Réalisation Macsimedia</a>

<style>
    *{
        margin: 0;
        padding: 0;
    }
    #content {
        margin: 0 auto;
        text-align: center;
    }
    .header {
        width: 100vw;
        height: auto;
        padding-top: 8vw;
        margin-bottom: 20vw;
        display: none;
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
        font-size: 2vw;
        padding-top: 0.6vw;
        width: 27vw;
    }
    .svelte-4m28l7 {
        text-align: center;
        font-size: 1.6vw;
    }
    #footer {
        position: absolute;
        bottom: 0;
        right: 1px;
        text-align: right;
        width: 50vw;
        font-size: 0.7vw;
        font-style: italic;
        font-weight: lighter;
        color: white;
    }

    @media only screen and (max-width: 640px) {
        .svelte-bti8of {
            font-size: 5vw;
            width: 60vw;
        }
        .svelte-4m28l7 {
            font-size: 5vw;
        }
        #flammeLogo{
            position: absolute;
            width: 7vw;
            height: 96px;
        }
        #button {
            width: 35vw;
        }
        #footer {
            position: absolute;
            bottom: 0;
            right: 1px;
            text-align: right;
            width: 50vw;
            font-size: 1.5vw;
            font-style: italic;
            font-weight: lighter;
            color: white;
        }
    }
</style>