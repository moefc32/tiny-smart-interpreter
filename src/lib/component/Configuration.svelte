<script>
    import { LoaderCircle, Check } from 'lucide-svelte';
    import { toast } from 'svoast';
    import trimText from '$lib/trimText';

    export let config;

    let newConfig = { ...config };
    let isLoading = false;

    function sanitizeRealInput(event) {
        const input = event.target;
        let value = input.value;

        value = value.replace(/[^\d.]/g, '');

        const firstDotIndex = value.indexOf('.');
        if (firstDotIndex !== -1) {
            value =
                value.slice(0, firstDotIndex + 1) +
                value.slice(firstDotIndex + 1).replace(/\./g, '');
        }

        input.value = value;
    }

    function sanitizeIntegerInput(event) {
        const input = event.target;
        let value = input.value;

        value = value.replace(/[^0-9]/g, '');
        input.value = value;
    }

    function formatTemperature(event) {
        const value = event.target.value;

        if (value === '') {
            newConfig.temperature = config.temperature;
        } else {
            let num = parseFloat(value);
            if (num < 0) num = 0;
            if (num > 2) num = 2;
            newConfig.temperature = parseFloat(num.toFixed(1));
        }
    }

    function formatTopP(event) {
        const value = event.target.value;

        if (value === '') {
            newConfig.topP = config.topP;
        } else {
            let num = parseFloat(value);
            if (num < 0) num = 0;
            if (num > 1) num = 1;
            newConfig.topP = parseFloat(num.toFixed(1));
        }
    }

    function formatTopK(event) {
        const value = event.target.value;

        if (value === '') {
            newConfig.topK = config.topK;
        } else {
            let num = parseFloat(value);
            if (num < 1) num = 1;
            if (num > 100) num = 100;
            newConfig.topK = parseInt(num);
        }
    }

    async function saveConfig() {
        if (!newConfig.temperature || !newConfig.topP || !newConfig.topK) {
            return;
        }

        isLoading = true;

        try {
            const response = await fetch('/api/chat', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newConfig),
            });
            if (!response.ok) throw new Error();

            const result = await response.json();
            config = result.data;
            toast.success('Configuration saved successfully.');
        } catch (e) {
            console.error(e);
            toast.error('Error when saving configuration, please try again!');
        }

        isLoading = false;
    }
</script>

<section class="flex flex-1 flex-col justify-between">
    <div
        class="card p-3 bg-gray-50 h-[calc(100vh-150px)] border-[1px] border-gray-200 overflow-y-auto shadow"
    >
        <div class="card p-6 bg-white border-[1px] border-gray-200 w-full">
            <div
                class="flex flex-col items-center gap-1 pt-[110px] px-6 bg-[url(/favicon.svg)] bg-no-repeat bg-top bg-[length:100px] w-full opacity-75"
            >
                <span class="text-lg text-center font-semibold">
                    {import.meta.env.VITE_APP_NAME}
                </span>
                <span class="text-gray-600 text-center">
                    <a href="https://mf-chan.com" target="_blank">Mfc</a> &copy;
                    2025
                </span>
            </div>
        </div>
        <fieldset class="fieldset">
            <legend class="fieldset-legend">System Instruction</legend>
            <textarea
                class="textarea w-full resize-none"
                rows="3"
                placeholder="Add an AI system instruction (optional)"
                disabled={isLoading}
                bind:value={newConfig.systemInstruction}
            ></textarea>
        </fieldset>
        <fieldset class="fieldset">
            <div class="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                <legend class="fieldset-legend important min-w-[80px]">
                    Temperature
                </legend>
                <input
                    type="text"
                    class="input w-full"
                    disabled={isLoading}
                    on:input={sanitizeRealInput}
                    on:blur={formatTemperature}
                    bind:value={newConfig.temperature}
                />
                <p class="label min-w-[250px]">Allowed range: 0.0-2.0</p>
            </div>
        </fieldset>
        <fieldset class="fieldset">
            <div class="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                <legend class="fieldset-legend important min-w-[80px]">
                    Top-P
                </legend>
                <input
                    type="text"
                    class="input w-full"
                    disabled={isLoading}
                    on:input={sanitizeRealInput}
                    on:blur={formatTopP}
                    bind:value={newConfig.topP}
                />
                <p class="label min-w-[250px]">Allowed range: 0.0-1.0</p>
            </div>
        </fieldset>
        <fieldset class="fieldset">
            <div class="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                <legend class="fieldset-legend important min-w-[80px]">
                    Top-K
                </legend>
                <input
                    type="text"
                    class="input w-full"
                    disabled={isLoading}
                    on:input={sanitizeIntegerInput}
                    on:blur={formatTopK}
                    bind:value={newConfig.topK}
                />
                <p class="label min-w-[250px]">Allowed range: 1-100</p>
            </div>
        </fieldset>
    </div>
    <button
        class="btn btn-primary shadow"
        disabled={(config.systemInstruction ==
            trimText(newConfig.systemInstruction) &&
            config.temperature == newConfig.temperature &&
            config.topP == newConfig.topP &&
            config.topK == newConfig.topK) ||
            !newConfig.temperature ||
            !newConfig.topP ||
            !newConfig.topK ||
            isLoading}
        on:click={() => saveConfig()}
    >
        {#if isLoading}
            <LoaderCircle size={14} class={'spin'} /> Loading...
        {:else}
            <Check size={14} /> Save
        {/if}
    </button>
</section>
