<script>
    import { tick } from 'svelte';
    import { Upload, LoaderCircle, Check } from 'lucide-svelte';
    import { toast } from 'svoast';
    import isMimeAllowed from '$lib/isMimeAllowed';

    let attachment = '';
    let fileInput = '';
    let customInterpret = '';
    let interpretation = '';
    let isLoading = false;
    let uploadProgress = 0;
    let isUploading = false;

    async function handleFileChange(event) {
        const file = event.target.files[0];
        if (fileInput) fileInput.value = '';

        if (!file) return;

        if (!isMimeAllowed(file.type)) {
            return toast.warning('Unsupported file type!');
        }

        attachment = file;
    }

    async function stopLoading() {
        isUploading = false;
        isLoading = false;
        await tick();
    }

    async function interpretFile() {
        if (!attachment) return;

        isLoading = true;
        uploadProgress = 0;
        isUploading = true;

        try {
            const formData = new FormData();
            formData.append('finetune', customInterpret);
            formData.append('attachment', attachment);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/interpret');

            xhr.upload.onprogress = async event => {
                if (event.lengthComputable) {
                    uploadProgress = Math.round(
                        (event.loaded / event.total) * 100,
                    );

                    await tick();
                }
            };

            xhr.onload = async () => {
                if (xhr.status === 200) {
                    const result = JSON.parse(xhr.responseText);
                    interpretation = result.data;
                } else {
                    toast.error(
                        'Cannot get proper response, please try again!',
                    );
                }

                await stopLoading();
            };

            xhr.onerror = async () => {
                await stopLoading();
                toast.error('Network error occurred, please try again!');
            };

            xhr.send(formData);
        } catch (e) {
            await stopLoading();

            console.error(e);
            toast.error('Cannot get proper response, please try again!');
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
                        {attachment?.type}
                    </span>
                </div>
                <div class="text-sm truncate" title={attachment?.name}>
                    {attachment?.name}
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
                    <span class="block pb-6 truncate" title={attachment?.name}>
                        {#if attachment}
                            {attachment?.name}
                        {:else}
                            No file selected
                        {/if}
                    </span>
                </div>
                <div
                    class="{isUploading
                        ? 'flex'
                        : 'hidden'} items-center gap-3 px-4 py-6 w-full absolute bottom-0"
                >
                    <span class="text-sm">Uploading</span>
                    <progress
                        class="progress progress-info w-full h-3"
                        value={uploadProgress}
                        min="0"
                        max="100"
                    ></progress>
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
                <LoaderCircle size={14} class={'spin'} /> Processing File...
            {:else}
                <Check size={14} /> Process File
            {/if}
        </button>
    {/if}
</section>
