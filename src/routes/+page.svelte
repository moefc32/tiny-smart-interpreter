<script>
    import { onMount, tick } from 'svelte';
    import { MessageSquare, File, X, Settings } from 'lucide-svelte';
    import { toast } from 'svoast';

    import Chat from '$lib/component/Chat.svelte';
    import Interpret from '$lib/component/Interpret.svelte';
    import Configuration from '$lib/component/Configuration.svelte';

    export let data;

    let { chatHistory } = data;

    let chatContainer;
    let chatInput;
    let activeTab = 0;
    let chat = '';
    let isLoading = false;

    function scrollToBottom() {
        if (chatContainer) {
            chatContainer.scrollTo({
                top: chatContainer.scrollHeight,
                behavior: 'smooth',
            });
        }
    }

    async function clearChatHistory() {
        if (!isLoading) {
            try {
                const response = await fetch('/api/chat', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                chatHistory = [];
            } catch (e) {
                console.error(e);
                toast.error('Cannot clear chat history, please try again!');
            }
        }
    }

    onMount(() => {
        setTimeout(() => {
            scrollToBottom();
            chatInput?.focus();
        }, 50);
    });

    $: (async () => {
        if (activeTab === 0 && chatHistory.length) {
            await tick();
            scrollToBottom();
        }
    })();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<main class="flex flex-1 flex-col gap-3 p-6 w-full max-w-xl">
    <section class="flex gap-3 items-center w-full">
        <div role="tablist" class="tabs tabs-lift">
            <span
                role="tab"
                class="tab {activeTab === 0 && 'tab-active'}"
                tabindex="0"
                on:click={() => (activeTab = 0)}
            >
                <MessageSquare size={12} class={'me-1'} />
                <span class="sm:hidden">Chat</span>
                <span class="hidden sm:inline">Chat with AI</span>
            </span>
            <span
                role="tab"
                class="tab {activeTab === 1 && 'tab-active'}"
                tabindex="0"
                on:click={() => (activeTab = 1)}
            >
                <File size={12} class={'me-1'} />
                <span class="sm:hidden">Interpret</span>
                <span class="hidden sm:inline">Interpret File</span>
            </span>
            <!-- <span
                role="tab"
                class="tab {activeTab === 2 && 'tab-active'}"
                tabindex="0"
                on:click={() => (activeTab = 2)}
            >
                <Settings size={12} class={'me-1'} />
                <span>Settings</span>
            </span> -->
        </div>
        {#if activeTab === 0}
            <button
                class="btn btn-sm btn-outline btn-error ms-auto hover:text-white"
                title="Clear chat history"
                disabled={!chatHistory.length || isLoading}
                on:click={() => clearChatHistory()}
            >
                <X size={12} />
                <span class="hidden sm:inline">Clear</span>
            </button>
        {/if}
    </section>
    {#if activeTab === 0}
        <Chat
            bind:chatHistory
            bind:chatContainer
            bind:chatInput
            bind:chat
            bind:isLoading
        />
    {:else if activeTab === 1}
        <Interpret />
    {:else}
        <Configuration />
    {/if}
</main>
