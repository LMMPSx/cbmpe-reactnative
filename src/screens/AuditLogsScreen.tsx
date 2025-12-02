import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    FlatList,
    Alert,
    Modal,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import CustomHeader from "../components/CustomHeader";
import CustomFooter from "../components/CustomFooter";

// ⚠️ SIMULAÇÃO DO SERVIÇO DE LOGS E DADOS FIXOS
// Mantendo a simulação de dados e serviço para a funcionalidade do componente.
const buscarLogsAuditoria = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
        { id: 1, dataHoraISO: "2025-11-30T10:00:00", dataHora: "30/11 10:00", usuario: "joao.santos", modulo: "Ocorrências", acao: "Criação", atributo: "N/A", valorNovo: "Incêndio", valorAntigo: "N/A" },
        { id: 2, dataHoraISO: "2025-12-02T11:20:00", dataHora: "02/12 11:20", usuario: "maria.alves", modulo: "Usuários", acao: "Edição", atributo: "Permissão", valorNovo: "Admin", valorAntigo: "User" },
        { id: 3, dataHoraISO: "2025-12-02T11:25:00", dataHora: "02/12 11:25", usuario: "joao.santos", modulo: "Ocorrências", acao: "Exclusão", atributo: "Status", valorNovo: "N/A", valorAntigo: "Finalizado" },
        { id: 4, dataHoraISO: "2025-11-28T15:00:00", dataHora: "28/11 15:00", usuario: "pedro.lima", modulo: "Relatórios", acao: "Visualização", atributo: "Relatório", valorNovo: "Rel. Mensal", valorAntigo: "N/A" },
        { id: 5, dataHoraISO: "2025-12-01T08:30:00", dataHora: "01/12 08:30", usuario: "maria.alves", modulo: "Ocorrências", acao: "Criação", atributo: "N/A", valorNovo: "Resgate", valorAntigo: "N/A" },
        { id: 6, dataHoraISO: "2025-12-02T11:30:00", dataHora: "02/12 11:30", usuario: "joao.santos", modulo: "Ocorrências", acao: "Edição", atributo: "Prioridade", valorNovo: "Alta", valorAntigo: "Média" },
    ];
};

const extractUniqueOptions = (logs: any[], key: string) => ['Todos', ...new Set(logs.map(log => log[key]))].filter(Boolean);


export default function AuditLogsScreen({ navigation }: any) {
    // 1. ESTADOS PARA DADOS DINÂMICOS
    const [initialLogs, setInitialLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 2. ESTADOS PARA OPÇÕES DE FILTRO
    const [uniqueUsers, setUniqueUsers] = useState<string[]>(['Todos']);
    const [uniqueModules, setUniqueModules] = useState<string[]>(['Todos']);
    const [uniqueActions, setUniqueActions] = useState<string[]>(['Todos']);
    const periodOptions = ['Qualquer data', 'Hoje', 'Últimos 7 dias'];

    // Estados de controle do filtro
    const [periodo, setPeriodo] = useState('Qualquer data');
    const [usuario, setUsuario] = useState('Todos');
    const [acao, setAcao] = useState('Todos');
    const [modulo, setModulo] = useState('Todos'); // Corrigido para "modulo"

    // Estado para o Modal
    const [modalVisible, setModalVisible] = useState(false);
    const [currentFilterKey, setCurrentFilterKey] = useState('');
    const [currentFilterOptions, setCurrentFilterOptions] = useState<string[]>([]);
    const [currentFilterDisplay, setCurrentFilterDisplay] = useState(''); // Novo estado para exibir o título do modal

    // 3. PAGINAÇÃO E EXPORTAÇÃO
    const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5; 

    const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentLogs = filteredLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // --- LÓGICA DE BUSCA DE DADOS ---
    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await buscarLogsAuditoria();
                setInitialLogs(data);

                // Extrai as opções de filtro dos dados
                setUniqueUsers(extractUniqueOptions(data, 'usuario'));
                setUniqueModules(extractUniqueOptions(data, 'modulo'));
                setUniqueActions(extractUniqueOptions(data, 'acao'));

            } catch (err) {
                setError("Erro ao carregar logs de auditoria.");
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    // Função auxiliar para converter data ISO
    const parseDateISO = useCallback((isoString: string) => {
        return new Date(isoString);
    }, []);

    // --- FUNÇÃO PRINCIPAL DE FILTRO (useCallback) ---
    const handleFilter = useCallback(() => {
        let data = [...initialLogs];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Filtro de Período
        if (periodo === 'Hoje') {
            data = data.filter(log => {
                const logDate = parseDateISO(log.dataHoraISO);
                logDate.setHours(0, 0, 0, 0);
                return logDate.getTime() === today.getTime();
            });
        } else if (periodo === 'Últimos 7 dias') {
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 7);

            data = data.filter(log => {
                const logDate = parseDateISO(log.dataHoraISO);
                return logDate >= sevenDaysAgo;
            });
        }

        // 2. Outros Filtros (Usuário, Ação, Módulo)
        if (usuario !== 'Todos') data = data.filter(log => log.usuario === usuario);
        if (acao !== 'Todos') data = data.filter(log => log.acao === acao);
        if (modulo !== 'Todos') data = data.filter(log => log.modulo === modulo);

        setFilteredLogs(data);
        setCurrentPage(1); 
    }, [initialLogs, periodo, usuario, acao, modulo, parseDateISO]);

    // 3. EFEITO PARA APLICAR FILTRO
    useEffect(() => {
        handleFilter();
    }, [handleFilter]);

    // --- FUNÇÕES DE CONTROLE DE MODAL ---

    const openFilterModal = (key: 'periodo' | 'usuario' | 'acao' | 'modulo', options: string[], display: string) => {
        setCurrentFilterKey(key);
        setCurrentFilterOptions(options);
        setCurrentFilterDisplay(display); // Define o título amigável
        setModalVisible(true);
    };

    const handleSelectFilter = (value: string) => {
        switch (currentFilterKey) {
            case 'periodo': setPeriodo(value); break;
            case 'usuario': setUsuario(value); break;
            case 'acao': setAcao(value); break;
            case 'modulo': setModulo(value); break;
        }
        setModalVisible(false);
    };

    // Define a opção de filtro atual para exibição (Usado nos botões de filtro)
    const getFilterLabel = (key: 'periodo' | 'usuario' | 'acao' | 'modulo', value: string) => {
        const defaultLabels: { [key: string]: string } = {
            periodo: 'Período',
            usuario: 'Usuário',
            acao: 'Ação realizada',
            modulo: 'Módulo'
        };
        if (value === 'Todos' || value === 'Qualquer data') return defaultLabels[key];
        return value;
    };

    const currentPeriodLabel = getFilterLabel('periodo', periodo);
    const currentUserLabel = getFilterLabel('usuario', usuario);
    const currentActionLabel = getFilterLabel('acao', acao);
    const currentModuleLabel = getFilterLabel('modulo', modulo);


    // --- FUNÇÕES DE EXPORTAÇÃO (Simuladas) ---

    const generateCsvContent = (data: any[]) => {
        const header = "Data/Hora,Usuário,Módulo,Ação,Atributo Alterado,Valor Novo,Valor Antigo\n";
        const rows = data.map(log => 
            `${log.dataHora},${log.usuario},${log.modulo},${log.acao},${log.atributo},"${log.valorNovo}",${log.valorAntigo}`
        ).join('\n');
        return header + rows;
    };

    const handleExportCSV = () => {
        if (filteredLogs.length === 0) return Alert.alert("Erro", "Não há dados para exportar.");
        const csvContent = generateCsvContent(filteredLogs);
        Alert.alert("Sucesso", `Exportação CSV iniciada (${filteredLogs.length} linhas).`);
        console.log("CSV Exportado:\n", csvContent);
    };

    const handleExportPDF = () => {
        if (filteredLogs.length === 0) return Alert.alert("Erro", "Não há dados para exportar.");
        Alert.alert("Sucesso", `Exportação PDF iniciada (${filteredLogs.length} linhas).`);
    };


    // --- RENDERIZAÇÃO ---
    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <CustomHeader title="Auditoria & Logs" navigation={navigation} />
                <View style={[styles.scrollContent, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color="#001F3F" />
                    <Text style={{ marginTop: 10 }}>Carregando logs...</Text>
                </View>
                <CustomFooter navigation={navigation} activeRoute="Usuario" />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <CustomHeader title="Auditoria & Logs" navigation={navigation} />
                <View style={[styles.scrollContent, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ color: 'red' }}>{error}</Text>
                </View>
                <CustomFooter navigation={navigation} activeRoute="Usuario" />
            </SafeAreaView>
        );
    }
    
    // Item de renderização para o FlatList
    const renderLogItem = ({ item }: { item: any }) => (
        <View style={styles.logItem}>
            <Text style={styles.logItemHeader}>
                <Text style={{ fontWeight: 'bold' }}>{item.dataHora}</Text> | {item.usuario}
            </Text>
            <Text style={styles.logItemDetail}>
                <Text style={{ fontWeight: 'bold' }}>{item.acao}</Text> em {item.modulo}
            </Text>
            {item.atributo !== 'N/A' && (
                <Text style={styles.logItemDetail}>
                    {item.atributo}: {item.valorAntigo} {'->'} <Text style={{fontWeight: 'bold'}}>{item.valorNovo}</Text>
                </Text>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#001F3F" barStyle="light-content" />
            <CustomHeader title="Auditoria & Logs" navigation={navigation} />

            <View style={{ flex: 1 }}>
                <FlatList
                    data={currentLogs}
                    keyExtractor={(item) => item.id.toString()}
                    ListHeaderComponent={() => (
                        <View style={styles.scrollContent}>
                            {/* --- FILTROS --- */}
                            <View style={styles.filtersContainer}>
                                <View style={styles.filterRow}>
                                    <TouchableOpacity 
                                        style={styles.filterBox}
                                        onPress={() => openFilterModal('periodo', periodOptions, 'Período')}
                                    >
                                        {/* Exibindo o filtro selecionado */}
                                        <Text style={styles.filterText}>{currentPeriodLabel}</Text>
                                        <Ionicons name="chevron-down-circle" size={20} color="#000" />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.filterBox}
                                        onPress={() => openFilterModal('usuario', uniqueUsers, 'Usuário')}
                                    >
                                        {/* Exibindo o filtro selecionado */}
                                        <Text style={styles.filterText}>{currentUserLabel}</Text>
                                        <Ionicons name="chevron-down-circle" size={20} color="#000" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.filterRow}>
                                    <TouchableOpacity 
                                        style={styles.filterBox}
                                        onPress={() => openFilterModal('acao', uniqueActions, 'Ação realizada')}
                                    >
                                        {/* Exibindo o filtro selecionado */}
                                        <Text style={styles.filterText}>{currentActionLabel}</Text>
                                        <Ionicons name="chevron-down-circle" size={20} color="#000" />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.filterBox}
                                        onPress={() => openFilterModal('modulo', uniqueModules, 'Módulo')}
                                    >
                                        {/* Exibindo o filtro selecionado */}
                                        <Text style={styles.filterText}>{currentModuleLabel}</Text>
                                        <Ionicons name="chevron-down-circle" size={20} color="#000" />
                                    </TouchableOpacity>
                                </View>
                                
                                {/* Botão Filtrar/Aplicar - Mantido na estrutura original do seu código */}
                                <TouchableOpacity 
                                    style={styles.btnFiltrar}
                                    onPress={() => handleFilter()} 
                                >
                                    <Text style={styles.btnFiltrarText}>Filtrar ({filteredLogs.length})</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Informação sobre Logs Filtrados */}
                            <Text style={[styles.paginationText, { textAlign: 'left', marginBottom: 5, paddingHorizontal: 20 }]}>
                                {filteredLogs.length === 0 ? "Nenhum log encontrado." : `Logs filtrados: ${filteredLogs.length}`}
                            </Text>

                            {/* Botões de Paginação Acima da Lista */}
                            <View style={[styles.exportRow, styles.paginationRow, { justifyContent: 'space-between', marginBottom: 10, paddingHorizontal: 20 }]}>
                                <TouchableOpacity 
                                    style={[styles.paginationBtn, { opacity: currentPage === 1 ? 0.5 : 1 }]}
                                    onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    <Ionicons name="arrow-back" size={20} color="#000" />
                                </TouchableOpacity>
                                <Text style={styles.paginationText}>Página {currentPage} de {totalPages}</Text>
                                <TouchableOpacity 
                                    style={[styles.paginationBtn, { opacity: currentPage === totalPages ? 0.5 : 1 }]}
                                    onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                >
                                    <Ionicons name="arrow-forward" size={20} color="#000" />
                                </TouchableOpacity>
                            </View>

                        </View>
                    )}
                    renderItem={renderLogItem}
                    ListFooterComponent={() => (
                        <View style={styles.scrollContent}>
                            {/* --- BOTÕES DE EXPORTAÇÃO --- */}
                            <View style={styles.exportRow}>
                                <TouchableOpacity style={styles.exportBtn} onPress={handleExportCSV}>
                                    <Text style={styles.exportText}>Exportar CSV</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.exportBtn} onPress={handleExportPDF}>
                                    <Text style={styles.exportText}>Exportar PDF</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </View>

            <CustomFooter navigation={navigation} activeRoute="Usuario" />

            {/* --- MODAL DE SELEÇÃO DE FILTRO --- */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Selecione {currentFilterDisplay}</Text>
                        <FlatList
                            data={currentFilterOptions}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    style={styles.modalItem}
                                    onPress={() => handleSelectFilter(item)}
                                >
                                    <Text style={styles.modalItemText}>{item}</Text>
                                    {(
                                        (currentFilterKey === 'periodo' && periodo === item) ||
                                        (currentFilterKey === 'usuario' && usuario === item) ||
                                        (currentFilterKey === 'acao' && acao === item) ||
                                        (currentFilterKey === 'modulo' && modulo === item)
                                    ) && (
                                        <Ionicons name="checkmark" size={20} color="#001F3F" />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.modalCloseButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

// --- CSS ORIGINAL DO SEU COMPONENTE MOBILE ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFF" },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

    // Filtros
    filtersContainer: { marginBottom: 20 },
    filterRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    filterBox: {
        backgroundColor: "#E0E0E0",
        borderRadius: 10,
        height: 40,
        width: "48%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    filterText: { fontSize: 14, color: "#333" },
    btnFiltrar: {
        backgroundColor: "#FFCC00",
        alignSelf: "flex-end",
        paddingVertical: 8,
        paddingHorizontal: 25,
        borderRadius: 8,
    },
    btnFiltrarText: { fontWeight: "bold", color: "#000" },

    // Lista (Adaptei o placeholder para a exibição real dos logs)
    listContainer: { gap: 15, marginBottom: 10 },
    logItem: {
        backgroundColor: "#F8F8F8",
        padding: 10,
        borderRadius: 8,
        borderLeftWidth: 5,
        borderLeftColor: '#001F3F',
        marginBottom: 8,
        marginHorizontal: 20, // Ajuste para o padding do FlatList
    },
    logItemHeader: {
        fontSize: 12,
        marginBottom: 3,
        color: '#001F3F',
    },
    logItemDetail: {
        fontSize: 11,
        color: '#666',
    },

    // Paginação
    paginationText: {
        textAlign: "right",
        color: "#333",
        fontSize: 12,
    },
    paginationRow: {
        paddingHorizontal: 0, 
        alignItems: 'center',
    },
    paginationBtn: {
        backgroundColor: '#DDD',
        padding: 5,
        borderRadius: 5,
    },

    // Exportar
    exportRow: { flexDirection: "row", justifyContent: "space-between", gap: 15, paddingHorizontal: 0 },
    exportBtn: {
        flex: 1,
        backgroundColor: "#FFCC00",
        height: 55,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    exportText: { fontSize: 16, fontWeight: "bold", color: "#000" },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '60%',
        minHeight: '40%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingBottom: 5,
    },
    modalItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalItemText: {
        fontSize: 16,
    },
    modalCloseButton: {
        backgroundColor: '#C8102E',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
    },
    modalCloseButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    }
});