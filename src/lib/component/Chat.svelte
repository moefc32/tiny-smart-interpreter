<script>
    import { LoaderCircle, Send } from 'lucide-svelte';
    import datePrettier from '$lib/datePrettier.js';

    export let chatHistory;
    export let chatContainer;
    export let chatInput;
    export let chat;
    export let isLoading;
    export let sendChat;

    async function handleKeydown(event) {
        if (event.key === 'Enter' && chat) {
            sendChat();
        }
    }
</script>

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
                    No conversations yet, send a message to begin interacting
                    with your AI assistant
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
            placeholder="Type message here..."
            disabled={isLoading}
            bind:this={chatInput}
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
