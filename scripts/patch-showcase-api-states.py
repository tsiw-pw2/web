from pathlib import Path

p = Path(__file__).resolve().parents[1] / "src/modules/dev/pages/ComponentShowcasePage.vue"
t = p.read_text()

nav_old = """    { id: "states", label: "Estados" },
    { id: "table", label: "Tabela" },"""

nav_new = """    { id: "states", label: "Estados" },
    { id: "api-states", label: "Estados API" },
    { id: "table", label: "Tabela" },"""

t = t.replace(nav_old, nav_new, 1)

imports_anchor = "import ShowcaseSection from"
new_imports = """import type { CampaignListItem } from "@/modules/campaigns/types/list"
import { registrationRoleLabel, registrationStatusLabel } from "@/modules/campaigns/lib/registrationLabels"
import CampaignsListState from "@/modules/campaigns/views/states/CampaignsListState.vue"
import ShowcaseSection from"""

if "CampaignsListState" not in t:
    t = t.replace(imports_anchor, new_imports, 1)

imports_ui = "import Button from"
new_ui = """import ApiStateBadge from "@/shared/components/ui/ApiStateBadge.vue"
import Button from"""

if "ApiStateBadge" not in t:
    t = t.replace(imports_ui, new_ui, 1)

imports_api = "import Textarea from"
new_api = """import {
    CAMPAIGN_EDIT_STATUS_ITEMS,
    COMMENT_HIDDEN_BADGE,
    REGISTRATION_ROLE_ITEMS,
    REGISTRATION_STATUS_ITEMS,
    WASTE_CATEGORY_ITEMS,
    WASTE_UNIT_ITEMS,
    campaignDetailStatusBadge,
    userAccountStateBadge,
} from "@/shared/lib/apiStatePresentation"
import Textarea from"""

if "apiStatePresentation" not in t:
    t = t.replace(imports_api, new_api, 1)

data_old = """const tableRows = [
    { id: "1", name: "Praia da Rocha", district: "Faro", quantity: "12" },
    { id: "2", name: "Costa Nova", district: "Aveiro", quantity: "3" },
    { id: "3", name: "Foz do Arelho", district: "Leiria", quantity: "128" },
    { id: "4", name: "São Pedro de Moel", district: "Leiria", quantity: "0" },
    { id: "5", name: "Miramar", district: "Porto", quantity: "45" },
]

const longLabel = "Nome muito longo que deve truncar na célula da tabela sem partir o layout"
"""

data_new = """const campaignDemoItems: CampaignListItem[] = [
    {
        id: "demo-1",
        title: "Limpeza Costa da Caparica",
        municipality: "Almada",
        beach: "Praia do CDP, Praia do Dragão",
        startDate: "12/04/2026",
        endDate: "12/04/2026",
    },
    {
        id: "demo-2",
        title: "Voluntários Matosinhos",
        municipality: "Matosinhos",
        beach: "Praia da Azul",
        startDate: "03/05/2026",
        endDate: "04/05/2026",
    },
    {
        id: "demo-3",
        title: "Ria de Aveiro — norte",
        municipality: "Ílhavo",
        beach: "Praia da Barra",
        startDate: "18/06/2026",
        endDate: "20/06/2026",
    },
    {
        id: "demo-4",
        title: "São Martinho do Porto",
        municipality: "Alcobaça",
        beach: "Praia de São Martinho",
        startDate: "01/07/2026",
        endDate: "01/07/2026",
    },
]

const campaignDemoPage = ref(1)
const campaignDetailStatusSamples = [0, 1, 2] as const
"""

if "campaignDemoItems" not in t:
    t = t.replace(data_old, data_new, 1)

table_section_start = '                <ShowcaseSection id="table"'
table_section_end = '                <ShowcaseSection id="pagination"'

start = t.index(table_section_start)
end = t.index(table_section_end)

new_table = """                <ShowcaseSection id="table" title="Tabela (como na app)" description="Mesmo markup que Campanhas: ScrollableTableSection fill-container, linhas com hover, sem moldura extra.">
                    <div class="flex min-h-[360px] flex-col gap-6 bg-white px-px">
                        <h3 class="text-xl font-semibold leading-8 text-neutral-950">Campanhas</h3>
                        <ScrollableTableSection fill-container class="min-h-0 flex-1">
                            <CampaignsListState
                                :items="campaignDemoItems"
                                @select="() => {}"
                                @edit="() => {}"
                                @delete="() => {}"
                            />
                            <template #footer>
                                <ListPaginationBar
                                    :page="campaignDemoPage"
                                    :page-size="10"
                                    :total="campaignDemoItems.length"
                                    @prev="campaignDemoPage = Math.max(1, campaignDemoPage - 1)"
                                    @next="campaignDemoPage = campaignDemoPage + 1"
                                />
                            </template>
                        </ScrollableTableSection>
                    </motion>
                </ShowcaseSection>

"""

new_table = new_table.replace("<motion", "<div").replace("</motion>", "</div>")

api_states_section = """                <ShowcaseSection
                    id="api-states"
                    title="Estados da API"
                    description="Valores e apresentação alinhados ao contrato REST (badges onde a app os usa; restantes como na tabela de detalhe)."
                >
                    <div class="flex flex-col gap-8">
                        <div>
                            <p class="mb-3 text-sm font-medium text-neutral-800">Campanha — detalhe (status agrupado na UI)</p>
                            <div class="flex flex-wrap gap-2">
                                <ApiStateBadge
                                    v-for="s in campaignDetailStatusSamples"
                                    :key="s"
                                    v-bind="campaignDetailStatusBadge(s)"
                                />
                            </motion>
                        </motion>
                        <div>
                            <p class="mb-3 text-sm font-medium text-neutral-800">Campanha — escrita (status no body)</p>
                            <ul class="grid gap-2 sm:grid-cols-2">
                                <li
                                    v-for="item in CAMPAIGN_EDIT_STATUS_ITEMS"
                                    :key="item.apiKey"
                                    class="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 text-sm shadow-card"
                                >
                                    <span class="font-medium text-neutral-900">{{ item.label }}</span>
                                    <span class="font-mono text-xs text-neutral-500">{{ item.apiKey }} · BD {{ item.db }}</span>
                                </li>
                            </ul>
                        </motion>
                        <div>
                            <p class="mb-3 text-sm font-medium text-neutral-800">Conta de utilizador</p>
                            <motion class="flex flex-wrap gap-2">
                                <ApiStateBadge v-bind="userAccountStateBadge(true)" />
                                <ApiStateBadge v-bind="userAccountStateBadge(false)" />
                            </motion>
                        </motion>
                        <div>
                            <p class="mb-3 text-sm font-medium text-neutral-800">Comentário (moderação)</p>
                            <ApiStateBadge v-bind="COMMENT_HIDDEN_BADGE" />
                        </motion>
                        <div>
                            <p class="mb-3 text-sm font-medium text-neutral-800">Inscrição — role e status (texto na tabela)</p>
                            <DataTableScrollWrap>
                                <table class="w-full min-w-[320px] table-fixed border-collapse text-left">
                                    <thead class="sticky top-0 z-10 bg-white">
                                        <tr class="border-b border-neutral-200">
                                            <DataTableTh>Campo API</DataTableTh>
                                            <DataTableTh>Exemplo</DataTableTh>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            v-for="row in REGISTRATION_ROLE_ITEMS"
                                            :key="`role-${row.value}`"
                                            class="border-b border-neutral-200 last:border-b-0"
                                        >
                                            <DataTableTd emphasis>role = {{ row.value }}</DataTableTd>
                                            <DataTableTd>{{ registrationRoleLabel(row.value) }}</DataTableTd>
                                        </tr>
                                        <tr
                                            v-for="row in REGISTRATION_STATUS_ITEMS"
                                            :key="`status-${row.value}`"
                                            class="border-b border-neutral-200 last:border-b-0"
                                        >
                                            <DataTableTd emphasis>status = {{ row.value }}</DataTableTd>
                                            <DataTableTd>{{ registrationStatusLabel(row.value) }}</DataTableTd>
                                        </tr>
                                    </tbody>
                                </table>
                            </DataTableScrollWrap>
                        </motion>
                        <motion>
                            <p class="mb-3 text-sm font-medium text-neutral-800">Resíduo — categoria e unidade</p>
                            <div class="grid gap-4 sm:grid-cols-2">
                                <ul class="space-y-1 rounded-lg bg-white p-3 text-sm shadow-card">
                                    <li v-for="c in WASTE_CATEGORY_ITEMS" :key="c.apiKey" class="flex justify-between gap-2">
                                        <span class="text-neutral-900">{{ c.label }}</span>
                                        <span class="font-mono text-xs text-neutral-500">{{ c.apiKey }}</span>
                                    </li>
                                </ul>
                                <ul class="space-y-1 rounded-lg bg-white p-3 text-sm shadow-card">
                                    <li v-for="u in WASTE_UNIT_ITEMS" :key="u.apiKey" class="flex justify-between gap-2">
                                        <span class="text-neutral-900">{{ u.label }}</span>
                                        <span class="font-mono text-xs text-neutral-500">{{ u.apiKey }}</span>
                                    </li>
                                </ul>
                            </motion>
                        </motion>
                    </motion>
                </ShowcaseSection>

"""

api_states_section = api_states_section.replace("<motion", "<motion").replace("<motion", "<motion")
api_states_section = api_states_section.replace("<motion", "<div").replace("</motion>", "</motion>")
api_states_section = api_states_section.replace("</motion>", "</div>")

insert_point = '                <ShowcaseSection id="table"'
if 'id="api-states"' not in t:
    t = t[:start] + api_states_section + new_table + t[end:]

else:
    t = t[:start] + new_table + t[end:]

header_old = "39 componentes em"
if header_old in t:
    t = t.replace(
        "39 componentes em <code class=\"text-neutral-800\">shared/components</code> — cobertura abaixo; partes internas do Select aparecem ao abrir a lista.",
        "Componentes partilhados e estados visuais do contrato API — alinhado à app.",
        1,
    )

p.write_text(t)
print("done")
