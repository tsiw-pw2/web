from pathlib import Path

p = Path(__file__).resolve().parents[1] / "src/modules/dev/pages/ComponentShowcasePage.vue"
t = p.read_text()
d, c = "div", "div"


def rep(old: str, new: str) -> None:
    global t
    if old not in t:
        raise SystemExit(f"Block not found:\n{old[:400]}")
    t = t.replace(old, new, 1)


rep(
    f"""                        <{d}>
                            <FieldLabel for="showcase-textarea" class="mb-2 block">Textarea</FieldLabel>
                            <Textarea id="showcase-textarea" v-model="textareaValue" class="w-full min-w-0" />
                        </{c}>
                    </{c}>
                </ShowcaseSection>

                <ShowcaseSection id="select" title="Select" description="Lista suspensa com opção desactivada e placeholder.">""",
    f"""                        <{d}>
                            <FieldLabel for="showcase-textarea" class="mb-2 block">Textarea</FieldLabel>
                            <Textarea id="showcase-textarea" v-model="textareaValue" class="w-full min-w-0" />
                        </{c}>
                        <{d}>
                            <FieldLabel for="showcase-textarea-icon" class="mb-2 block">Textarea com leftIcon</FieldLabel>
                            <Textarea id="showcase-textarea-icon" v-model="textareaValue" class="w-full min-w-0" left-icon="clock" />
                        </{c}>
                        <{d}>
                            <FieldLabel for="showcase-textarea-disabled" class="mb-2 block">Textarea desactivado</FieldLabel>
                            <Textarea id="showcase-textarea-disabled" model-value="Texto fixo" class="w-full min-w-0" disabled />
                        </{c}>
                    </{c}>
                </ShowcaseSection>

                <ShowcaseSection id="select" title="Select" description="disabled; panelPlacement above (abre para ver SelectTrigger / SelectList / SelectOptionRow).">""",
)

rep(
    f"""                        <{d}>
                            <FieldLabel class="mb-2 block">Select desactivado</FieldLabel>
                            <Select v-model="selectDisabledValue" class="w-full min-w-0" :options="selectOptions" placeholder="Indisponível" disabled />
                        </{c}>
                    </{c}>
                </ShowcaseSection>

                <ShowcaseSection id="modal" title="Modal" description="ModalRoot com ModalCloseButton e formulário de exemplo.">""",
    f"""                        <{d}>
                            <FieldLabel class="mb-2 block">Select desactivado</FieldLabel>
                            <Select v-model="selectDisabledValue" class="w-full min-w-0" :options="selectOptions" placeholder="Indisponível" disabled />
                        </{c}>
                        <{d}>
                            <FieldLabel class="mb-2 block">panelPlacement=&quot;above&quot;</FieldLabel>
                            <Select v-model="selectAboveValue" class="w-full min-w-0" :options="selectOptions" panel-placement="above" placeholder="Abre para cima" />
                        </{c}>
                    </{c}>
                </ShowcaseSection>

                <ShowcaseSection id="modal" title="Modal" description="ModalRoot md/lg, ModalCloseButton isolado e formulário de exemplo.">""",
)

table_old = """                                <thead class="sticky top-0 z-10 bg-white shadow-[0_1px_0_0_rgb(229_229_229)]">
                                    <tr>
                                        <DataTableTh>Nome</DataTableTh>
                                        <DataTableTh>Distrito</DataTableTh>
                                        <DataTableTh align="end" :padding-end="false">Acções</DataTableTh>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="row in tableRows" :key="row.id" class="border-t border-neutral-100">
                                        <DataTableTd emphasis>{{ row.name }}</DataTableTd>
                                        <DataTableTd>{{ row.district }}</DataTableTd>
                                        <DataTableActionsCell :row-id="row.id" @edit="() => {}" @delete="() => {}" />
                                    </tr>
                                </tbody>"""

table_new = """                                <thead class="sticky top-0 z-10 bg-white shadow-[0_1px_0_0_rgb(229_229_229)]">
                                    <tr>
                                        <DataTableTh>Nome</DataTableTh>
                                        <DataTableTh>Distrito</DataTableTh>
                                        <DataTableTh align="end">Qtd.</DataTableTh>
                                        <DataTableTh align="end" :padding-end="false">Acções</DataTableTh>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="row in tableRows" :key="row.id" class="border-t border-neutral-100">
                                        <DataTableTd emphasis>{{ row.name }}</DataTableTd>
                                        <DataTableTd>{{ row.district }}</DataTableTd>
                                        <DataTableTd align="end">{{ row.quantity }}</DataTableTd>
                                        <DataTableActionsCell :row-id="row.id" @edit="() => {}" @delete="() => {}" />
                                    </tr>
                                    <tr class="border-t border-neutral-100">
                                        <DataTableTd>{{ longLabel }}</DataTableTd>
                                        <DataTableTd>—</DataTableTd>
                                        <DataTableTd align="end">1</DataTableTd>
                                        <DataTableActionsCell row-id="edit-only" :show-delete="false" @edit="() => {}" @delete="() => {}" />
                                    </tr>
                                    <tr class="border-t border-neutral-100">
                                        <DataTableTd>Só apagar</DataTableTd>
                                        <DataTableTd>—</DataTableTd>
                                        <DataTableTd align="end">—</DataTableTd>
                                        <DataTableActionsCell row-id="delete-only" :show-edit="false" @edit="() => {}" @delete="() => {}" />
                                    </tr>
                                </tbody>"""

rep(table_old, table_new)

rep(
    """                <ShowcaseSection id="pagination" title="ListPaginationBar" description="Barra de paginação isolada.">
                    <ListPaginationBar :page="paginationPage" :page-size="5" :total="47" @prev="paginationPage = Math.max(1, paginationPage - 1)" @next="paginationPage = paginationPage + 1" />
                </ShowcaseSection>""",
    f"""                <ShowcaseSection id="pagination" title="ListPaginationBar" description="Estados: meio, primeira página (Anterior off), última página (Seguinte off).">
                    <{d} class="flex flex-col gap-4">
                        <ListPaginationBar :page="paginationPage" :page-size="5" :total="47" @prev="paginationPage = Math.max(1, paginationPage - 1)" @next="paginationPage = paginationPage + 1" />
                        <ListPaginationBar :page="paginationFirstPage" :page-size="5" :total="47" @prev="paginationFirstPage = Math.max(1, paginationFirstPage - 1)" @next="paginationFirstPage = paginationFirstPage + 1" />
                        <ListPaginationBar :page="paginationLastPage" :page-size="5" :total="47" @prev="paginationLastPage = Math.max(1, paginationLastPage - 1)" @next="paginationLastPage = paginationLastPage + 1" />
                    </{c}>
                </ShowcaseSection>""",
)

rep(
    """                <ShowcaseSection id="navigation" title="NavigationButton" description="Usado no header escuro; fundo simulado abaixo.">
                    <div class="inline-flex flex-col gap-1 rounded-xl bg-neutral-950 p-3">
                        <NavigationButton :to="routePaths.dashboard">Dashboard</NavigationButton>
                        <NavigationButton :to="routePaths.campaigns" :active-route-names="['campaigns', 'campaign-details']">Campanhas</NavigationButton>
                        <NavigationButton :to="routePaths.beaches">Praias</NavigationButton>
                    </div>
                </ShowcaseSection>

                <ShowcaseSection id="icons" title="Ícones" description="Componentes SVG partilhados (16–24px conforme o caso).">""",
    f"""                <ShowcaseSection id="navigation" title="NavigationButton" description="variant block; activeRouteNames; fundo escuro simulado.">
                    <{d} class="flex flex-wrap gap-6">
                        <{d} class="inline-flex flex-col gap-1 rounded-xl bg-neutral-950 p-3">
                            <NavigationButton :to="routePaths.dashboard">Dashboard</NavigationButton>
                            <NavigationButton :to="routePaths.campaigns" :active-route-names="['campaigns', 'campaign-details']">Campanhas</NavigationButton>
                            <NavigationButton :to="routePaths.beaches">Praias</NavigationButton>
                        </{c}>
                        <{d} class="w-48 rounded-xl bg-neutral-950 p-3">
                            <NavigationButton block :to="routePaths.login">block (ex. menu móvel)</NavigationButton>
                        </{c}>
                    </{c}>
                </ShowcaseSection>

                <ShowcaseSection id="layout" title="Layout (shell)" description="AppHeader, UserMenuDropdown e MobileBottomNav — requerem router; menu com dados demo em cache.">
                    <{d} class="space-y-6">
                        <{d} class="overflow-hidden rounded-xl border border-neutral-200">
                            <AppHeader />
                        </{c}>
                        <{d} class="flex items-center justify-end gap-3 rounded-xl border border-neutral-200 bg-neutral-950 px-4 py-3">
                            <span class="text-sm text-neutral-400">UserMenuDropdown</span>
                            <UserMenuDropdown />
                        </{c}>
                        <{d} class="showcase-force-mobile-nav mx-auto max-w-md overflow-hidden rounded-xl border border-neutral-200">
                            <MobileBottomNav />
                        </{c}>
                    </{c}>
                </ShowcaseSection>

                <ShowcaseSection id="login-fields" title="Login — destaque de erro" description="Padrão da página de entrada: contorno vermelho sem mensagem de credenciais (conta bloqueada usa só toast).">
                    <{d} class="mx-auto max-w-sm space-y-4 rounded-xl border border-neutral-200 bg-white p-4">
                        <{d}>
                            <FieldLabel for="showcase-login-email" class="mb-2 block" required>Email</FieldLabel>
                            <Input
                                id="showcase-login-email"
                                class="w-full"
                                :class="loginBlockedHighlight && inputErrorClass"
                                model-value="utilizador@exemplo.pt"
                            />
                        </{c}>
                        <{d}>
                            <FieldLabel for="showcase-login-password" class="mb-2 block" required>Senha</FieldLabel>
                            <Input
                                id="showcase-login-password"
                                type="password"
                                class="w-full"
                                :class="loginBlockedHighlight && inputErrorClass"
                                model-value="••••••••"
                            />
                        </{c}>
                        <Button type="button" variant="secondary" class="w-full justify-center" @click="loginBlockedHighlight = !loginBlockedHighlight">
                            {{ loginBlockedHighlight ? "Remover destaque" : "Simular conta bloqueada" }}
                        </Button>
                    </{c}>
                </ShowcaseSection>

                <ShowcaseSection id="icons" title="Ícones" description="Todos os SVG em shared/components/icons e toast (Select* usados dentro do Select aberto).">""",
)

if "<style scoped>" not in t:
    t = t.rstrip() + """

<style scoped>
.showcase-force-mobile-nav :deep(nav) {
    display: flex !important;
}
</style>
"""

p.write_text(t)
print("ok")
