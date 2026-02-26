<script>
    import { LoaderCircle, Send, Menu, X } from 'lucide-svelte';
    import { toast } from 'svoast';
    import datePrettier from '$lib/datePrettier.js';

    export let chatHistory;
    export let chatContainer;
    export let chatInput;
    export let chat;
    export let isLoading;

    async function handleKeydown(event) {
        if (event.key === 'Enter' && chat) {
            sendChat();
        }
    }

    function addToChatHistory(role, text, timestamp) {
        chatHistory = [...chatHistory, { role, text, timestamp }];
    }

    async function sendChat() {
        if (!chat) return;
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
            if (!response.ok) throw new Error();

            const result = await response.json();
            addToChatHistory('model', result.data, Date.now());
        } catch (e) {
            console.error(e);
            toast.error('Cannot get proper response, please try again!');
        }

        isLoading = false;
        setTimeout(() => {
            chatInput?.focus();
        }, 50);
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
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<section class="flex flex-1 flex-col justify-between">
    <div
        class="card p-3 bg-gray-50 h-[calc(100vh-150px)] border-[1px] border-gray-200 overflow-y-auto shadow"
        bind:this={chatContainer}
    >
        {#if !chatHistory.length}
            <div
                class="flex flex-1 justify-center items-center mx-auto text-gray-600 text-center max-w-[400px]"
            >
                <div
                    class="pt-[110px] px-6 bg-[url(/chat.svg)] bg-no-repeat bg-top bg-[length:100px] w-full opacity-75"
                >
                    No conversations yet, send a message to begin interacting
                    with your AI assistant
                </div>
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
                        {datePrettier(chat.timestamp, {
                            date: 'short',
                            time: 'short',
                        })}
                    </time>
                </div>
            {/each}
            {#if isLoading}
                <div class="chat chat-start">
                    <div class="chat-header">Thinking...</div>
                    <div class="chat-bubble chat-bubble-info">
                        <span class="loading loading-dots loading-xs -mb-2">
                        </span>
                    </div>
                </div>
            {/if}
        {/if}
    </div>
    <div class="flex justify-center items-center gap-2">
        <input
            type="text"
            class="input w-full shadow"
            placeholder="Type message here..."
            disabled={isLoading}
            bind:this={chatInput}
            bind:value={chat}
            on:keydown={handleKeydown}
        />
        <button
            class="btn btn-primary shadow"
            title="Send chat"
            disabled={!chat || isLoading}
            on:click={() => sendChat()}
        >
            {#if isLoading}
                <LoaderCircle size={14} class={'spin'} /> Loading...
            {:else}
                <Send size={14} /> Send
            {/if}
        </button>
        <div class="dropdown dropdown-top dropdown-end">
            <button
                class="px-0 cursor-pointer"
                title="View more action"
                tabindex="0"
            >
                <Menu size={24} />
            </button>
            <ul
                tabindex="0"
                class="dropdown-content menu bg-base-100 rounded-box w-48 p-0 bottom-[55px]! right-[10px]! z-1 shadow"
            >
                <li>
                    <button
                        class="btn btn-error {!chatHistory.length ||
                            isLoading ||
                            'text-white'}"
                        disabled={!chatHistory.length || isLoading}
                        on:click={() => clearChatHistory()}
                    >
                        <X size={14} /> Clear Chat History
                    </button>
                </li>
            </ul>
        </div>
    </div>
</section>
