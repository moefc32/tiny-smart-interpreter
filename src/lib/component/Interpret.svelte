<script>
    import { Upload, LoaderCircle, Check } from 'lucide-svelte';
    import { toast } from 'svoast';

    let attachment = '';
    let fileInput = '';
    let customInterpret = '';
    let interpretation = '';
    let isLoading = false;

    async function handleFileChange(event) {
        const file = event.target.files[0];

        if (file) {
            attachment = file;
        } else {
            attachment = null;
            if (fileInput) fileInput.value = '';
        }
    }

    async function interpretFile() {
        if (attachment) {
            isLoading = true;

            try {
                const formData = new FormData();
                formData.append('finetune', customInterpret);
                formData.append('attachment', attachment);

                const response = await fetch('/api/interpret', {
                    method: 'POST',
                    body: formData,
                });
                if (!response.ok) throw new Error();

                const result = await response.json();
                interpretation = result.data;
            } catch (e) {
                console.error(e);
                toast.error('Cannot get proper response, please try again!');
            }

            isLoading = false;
        }
    }

    function reset() {
        attachment = null;
        interpretation = null;
        customInterpret = '';
        if (fileInput) fileInput.value = '';
    }
</script>

<section class="flex flex-1 flex-col justify-between gap-3">
    {#if interpretation}
        <div
            class="card flex-1 p-3 bg-gray-50 max-h-[calc(100vh-155px)] border-[1px] border-gray-200 overflow-y-auto"
        >
            <div class="flex flex-col gap-2 mb-4">
                <div class="flex justify-center items-center">
                    <span class="flex-1 font-bold">Interpretation for :</span>
                    <span class="hidden sm:inline badge badge-success">
                        {attachment.type}
                    </span>
                </div>
                <div class="text-sm truncate" title={attachment.name}>
                    {attachment.name}
                </div>
            </div>
            {@html interpretation}
        </div>
        <button
            class="btn btn-accent"
            title="Interpret new file"
            on:click={() => reset()}
        >
            <Upload size={14} /> Interpret New File
        </button>
    {:else}
        <label
            for="attachment"
            class="{isLoading ||
                'cursor-pointer'} card flex flex-1 justify-center items-center p-3 bg-gray-50 border-[1px] border-gray-200 overflow-y-auto"
        >
            <input
                type="file"
                id="attachment"
                class="hidden"
                disabled={isLoading}
                on:change={handleFileChange}
                bind:this={fileInput}
            />
            <div
                class="flex flex-1 justify-center items-center mx-auto text-gray-600 text-center max-w-[400px]"
            >
                <div
                    class="mt-[95px] pt-[110px] px-6 bg-[length:100px]! w-full opacity-75"
                    style={`background: ${attachment ? 'url(/file.svg)' : 'url(/upload.svg)'} center top no-repeat;`}
                >
                    <span class="block pb-6 truncate">
                        {#if attachment}
                            {attachment.name}
                        {:else}
                            No file selected
                        {/if}
                    </span>
                </div>
            </div>
        </label>
        <textarea
            class="textarea w-full resize-none"
            rows="3"
            placeholder="Add a custom interpretation format (optional)"
            disabled={isLoading}
            bind:value={customInterpret}
        ></textarea>
        <button
            class="btn btn-primary"
            title="Process file to be interpreted"
            disabled={!attachment || isLoading}
            on:click={() => interpretFile()}
        >
            {#if isLoading}
                <LoaderCircle size={14} class={'spin'} /> Loading...
            {:else}
                <Check size={14} /> Process File
            {/if}
        </button>
    {/if}
</section>
