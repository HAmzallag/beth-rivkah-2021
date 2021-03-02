<script lang="ts">
    import type {Donation} from "./interfaces/Donation";

    export let donations: Donation[] = [];
    let textDefilant = "";

    $: {
        if(donations.length > 0){
            donations.map( function( don: Donation ){
                 textDefilant += don.fullName + ": " + don.originalAmount + don.originalCurrency +" - ";
            });
        }
    }
</script>

{textDefilant}


