<script>
    import { onMount, tick } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { MessageSquare, File, X, Settings } from 'lucide-svelte';
    import { toast } from 'svoast';

    import Chat from '$lib/component/Chat.svelte';
    import Interpret from '$lib/component/Interpret.svelte';
    import Configuration from '$lib/component/Configuration.svelte';

    export let data;

    let { activeTab, config, chatHistory } = data;

    let chatContainer;
    let chatInput;
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

    function tabNavigate(tab) {
        const url = new URL(window.location.href);
        activeTab = tab;

        switch (tab) {
            case 0:
                url.search = '';
                break;
            case 1:
                url.search = '?interpret';
                break;
            case 2:
                url.search = '?settings';
                break;
        }

        goto(url.pathname + url.search, {
            replaceState: true,
            noScroll: true,
        });
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

            setTimeout(() => {
                scrollToBottom();
            }, 50);
        }
    })();
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<main class="flex flex-1 flex-col gap-3 p-6 w-full max-w-xl">
    <section class="flex gap-2 items-center w-full">
        <button
            class="bg-[url(/favicon.svg)] bg-no-repeat bg-contain w-[28px] aspect-square cursor-pointer"
            on:click={() => tabNavigate(0)}
        ></button>
        <div role="tablist" class="tabs tabs-lift">
            <span
                role="tab"
                class="tab {activeTab === 0 && 'tab-active'}"
                tabindex="0"
                on:click={() => tabNavigate(0)}
            >
                <MessageSquare size={12} class={'me-1'} />
                <span class="sm:hidden">Chat</span>
                <span class="hidden sm:inline">Chat with AI</span>
            </span>
            <span
                role="tab"
                class="tab {activeTab === 1 && 'tab-active'}"
                tabindex="0"
                on:click={() => tabNavigate(1)}
            >
                <File size={12} class={'me-1'} />
                <span class="sm:hidden">Interpret</span>
                <span class="hidden sm:inline">Interpret File</span>
            </span>
            <span
                role="tab"
                class="tab {activeTab === 2 && 'tab-active'}"
                tabindex="0"
                on:click={() => tabNavigate(2)}
            >
                <Settings size={12} class={'me-1'} />
                <span>Settings</span>
            </span>
        </div>
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
        <Configuration bind:config />
    {/if}
</main>
