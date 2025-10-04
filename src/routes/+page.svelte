<script>
    import { onMount, tick } from 'svelte';
    import { X, LoaderCircle, Send } from 'lucide-svelte';
    import { toast } from 'svoast';
    import datePrettier from '$lib/datePrettier.js';

    export let data;

    let { chatHistory } = data;

    let chatContainer;
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

    async function handleKeydown(event) {
        if (event.key === 'Enter' && chat) {
            sendChat();
        }
    }

    function addToChatHistory(role, text, timestamp) {
        chatHistory = [...chatHistory, { role, text, timestamp }];
    }

    async function sendChat() {
        if (chat) {
            isLoading = true;

            const prompt = chat;
            addToChatHistory('user', prompt, Date.now());
            chat = '';

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        prompt,
                        timestamp: Date.now(),
                    }),
                });

                const result = await response.json();
                addToChatHistory('model', result.data, Date.now());
            } catch (e) {
                console.error(e);
                toast.error('Cannot get proper response, please try again!');
            }

            isLoading = false;
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
        scrollToBottom();
    });

    $: (async () => {
        if (chatHistory.length) {
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
                class="tab {!activeTab && 'tab-active'}"
                tabindex="0"
                on:click={() => (activeTab = 0)}
            >
                <span class="sm:hidden">Chat</span>
                <span class="hidden sm:inline">Chat with AI</span>
            </span>
            <span
                role="tab"
                class="tab {activeTab && 'tab-active'}"
                tabindex="0"
                on:click={() => (activeTab = 1)}
            >
                <span class="sm:hidden">Interpret</span>
                <span class="hidden sm:inline">Interpret File</span>
            </span>
        </div>
        {#if !activeTab}
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
    {#if !activeTab}
        <section class="flex flex-1 flex-col justify-between">
            <div
                class="card p-3 bg-gray-50 h-[calc(100vh-150px)] border-[1px] border-gray-200 overflow-y-auto"
                bind:this={chatContainer}
            >
                {#if !chatHistory.length}
                    <div
                        class="flex flex-1 justify-center items-center mx-auto text-gray-600 text-center max-w-[400px]"
                    >
                        <span
                            class="block pt-[120px] px-6 bg-[url(/chat.svg)] bg-no-repeat bg-top bg-[length:120px] opacity-85"
                        >
                            No conversations yet, start a new chat to begin
                            interacting with your AI assistant
                        </span>
                    </div>
                {:else}
                    {#each chatHistory as chat, i}
                        <div
                            class="chat {chat.role === 'user'
                                ? 'chat-end'
                                : 'chat-start'}"
                        >
                            <div class="chat-header">
                                {chat.role === 'user' ? 'You' : 'AI Assistant'}
                            </div>
                            <div
                                class="chat-bubble {chat.role === 'user'
                                    ? 'chat-bubble-accent'
                                    : 'chat-bubble-info'}"
                            >
                                {chat.text}
                            </div>
                            <time class="chat-footer opacity-75">
                                {datePrettier(chat.timestamp)}
                            </time>
                        </div>
                    {/each}
                {/if}
            </div>
            <div class="flex justify-center items-center gap-2">
                <input
                    type="text"
                    class="input w-full"
                    placeholder="Type chat here..."
                    disabled={isLoading}
                    bind:value={chat}
                    on:keydown={handleKeydown}
                />
                <button
                    class="btn btn-primary"
                    title="Send chat"
                    disabled={isLoading || !chat}
                    on:click={() => sendChat()}
                >
                    {#if isLoading}
                        <LoaderCircle size={14} class={'spin'} /> Loading...
                    {:else}
                        <Send size={14} /> Send
                    {/if}
                </button>
            </div>
        </section>
    {:else}
        <section class="flex flex-1 flex-col justify-between"></section>
    {/if}
</main>
