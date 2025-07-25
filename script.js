// Função de login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    // Credenciais de acesso
    if (username === 'admin' && password === '123456') {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        carregarDados();
        atualizarInterface();
        renderizarCalendario(new Date().getFullYear(), new Date().getMonth());
    } else {
        alert('Usuário ou senha incorretos!');
    }
});
// Dados do sistema
let dados = {
    movimentacoes: [],
    funcionarias: [],
    servicos: [],
    salarios: []
};
// Variáveis para o calendário
let anoCalendario = new Date().getFullYear();
let mesCalendario = new Date().getMonth();
// Função para salvar dados no localStorage
function salvarDados() {
    localStorage.setItem('vanittaStudio_dados', JSON.stringify(dados));
}
// Função para carregar dados do localStorage
function carregarDados() {
    const dadosSalvos = localStorage.getItem('vanittaStudio_dados');
    if (dadosSalvos) {
        dados = JSON.parse(dadosSalvos);
    } else {
        // Inicia com dados vazios
        dados.funcionarias = [];
        dados.movimentacoes = [];
        dados.servicos = [];
        dados.salarios = [];
        salvarDados();
    }
}
// Função para mostrar seções
function showSection(sectionId) {
    // Remove a classe active de todas as seções
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    // Adiciona a classe active na seção selecionada
    document.getElementById(sectionId).classList.add('active');
    // Remove a classe active de todos os links do sidebar
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    // Adiciona a classe active no link clicado
    const clickedLink = event.target.closest('.nav-link');
    if (clickedLink) {
        clickedLink.classList.add('active');
    }
    // Atualiza as interfaces específicas de cada seção
    if(sectionId === 'dashboard') atualizarDashboard();
    if(sectionId === 'relatorios') atualizarRelatorio();
    if(sectionId === 'calendario') renderizarCalendario(anoCalendario, mesCalendario);
}
// Função para logout
function logout() {
    if (confirm('Deseja realmente sair do sistema?')) {
        salvarDados();
        document.getElementById('mainApp').style.display = 'none';
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('loginForm').reset();
    }
}
// Função para salvar movimentação
function salvarMovimentacao() {
    const tipo = document.getElementById('tipoMovimentacao').value;
    const valor = parseFloat(document.getElementById('valorMovimentacao').value);
    const descricao = document.getElementById('descricaoMovimentacao').value;
    const data = document.getElementById('dataMovimentacao').value;
    const hora = document.getElementById('horaMovimentacao').value;
    if (valor && descricao && data && hora) {
        const movimentacao = {
            id: Date.now(),
            tipo: tipo,
            valor: valor,
            descricao: descricao,
            data: data,
            hora: hora
        };
        dados.movimentacoes.push(movimentacao);
        atualizarInterface();
        salvarDados();
        const modal = bootstrap.Modal.getInstance(document.getElementById('movimentacaoModal'));
        modal.hide();
        document.getElementById('formMovimentacao').reset();
        alert('Movimentação registrada com sucesso!');
    } else {
        alert('Preencha todos os campos obrigatórios!');
    }
}
// Função para excluir movimentação
function excluirMovimentacao(id) {
    if (confirm('Deseja realmente excluir esta movimentação?')) {
        dados.movimentacoes = dados.movimentacoes.filter(m => m.id !== id);
        atualizarInterface();
        salvarDados();
        alert('Movimentação excluída com sucesso!');
    }
}
// Função para atualizar tabela de caixa
function atualizarTabelaCaixa() {
    const tbody = document.querySelector('#tabelaCaixa tbody');
    tbody.innerHTML = '';
    dados.movimentacoes.forEach(mov => {
        const tr = document.createElement('tr');
        const dataHora = mov.hora ? `${new Date(mov.data).toLocaleDateString('pt-BR')} ${mov.hora}` : new Date(mov.data).toLocaleDateString('pt-BR');
        const tipoBadge = mov.tipo === 'entrada' ? '<span class="badge bg-success">Entrada</span>' : '<span class="badge bg-danger">Saída</span>';
        const valorClass = mov.tipo === 'entrada' ? 'text-success' : 'text-danger';
        const valorSinal = mov.tipo === 'entrada' ? '+' : '-';
        tr.innerHTML = `
            <td>${dataHora}</td>
            <td>${mov.descricao}</td>
            <td>${tipoBadge}</td>
            <td class="${valorClass}">${valorSinal}R$ ${mov.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="excluirMovimentacao(${mov.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}
// Função para salvar ou editar funcionária
function salvarFuncionaria() {
    const id = document.getElementById('idFuncionaria').value;
    const nome = document.getElementById('nomeFuncionaria').value;
    const cargo = document.getElementById('cargoFuncionaria').value;
    const salario = parseFloat(document.getElementById('salarioFuncionaria').value);
    const admissao = document.getElementById('admissaoFuncionaria').value;
    const contato = document.getElementById('contatoFuncionaria').value;
    if (nome && cargo && salario && admissao) {
        if (id) {
            // Editar funcionária existente
            const index = dados.funcionarias.findIndex(f => f.id == id);
            if (index !== -1) {
                dados.funcionarias[index] = {
                    id: parseInt(id),
                    nome: nome,
                    cargo: cargo,
                    salario: salario,
                    admissao: admissao,
                    contato: contato
                };
            }
        } else {
            // Adicionar nova funcionária
            const funcionaria = {
                id: Date.now(),
                nome: nome,
                cargo: cargo,
                salario: salario,
                admissao: admissao,
                contato: contato
            };
            dados.funcionarias.push(funcionaria);
        }
        atualizarInterface();
        salvarDados();
        const modal = bootstrap.Modal.getInstance(document.getElementById('funcionariaModal'));
        modal.hide();
        document.getElementById('formFuncionaria').reset();
        document.getElementById('idFuncionaria').value = '';
        alert(id ? 'Funcionária atualizada com sucesso!' : 'Funcionária cadastrada com sucesso!');
    } else {
        alert('Preencha todos os campos obrigatórios!');
    }
}
// Função para editar funcionária
function editarFuncionaria(id) {
    const funcionaria = dados.funcionarias.find(f => f.id === id);
    if (funcionaria) {
        document.getElementById('idFuncionaria').value = funcionaria.id;
        document.getElementById('nomeFuncionaria').value = funcionaria.nome;
        document.getElementById('cargoFuncionaria').value = funcionaria.cargo;
        document.getElementById('salarioFuncionaria').value = funcionaria.salario;
        document.getElementById('admissaoFuncionaria').value = funcionaria.admissao;
        document.getElementById('contatoFuncionaria').value = funcionaria.contato || '';
        const modal = new bootstrap.Modal(document.getElementById('funcionariaModal'));
        modal.show();
    }
}
// Função para excluir funcionária
function excluirFuncionaria(id) {
    if (confirm('Deseja realmente excluir esta funcionária?')) {
        dados.funcionarias = dados.funcionarias.filter(f => f.id !== id);
        atualizarInterface();
        salvarDados();
        alert('Funcionária excluída com sucesso!');
    }
}
// Função para atualizar lista de funcionárias
function atualizarListaFuncionarias() {
    const container = document.getElementById('listaFuncionarias');
    container.innerHTML = '';
    dados.funcionarias.forEach(func => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        const contatoFormatado = func.contato ? func.contato.replace(/\D/g, '') : '';
        col.innerHTML = `
            <div class="card shadow-sm">
                <div class="card-body text-center">
                    <i class="bi bi-person-circle" style="font-size: 3rem; color: var(--primary);"></i>
                    <h5 class="card-title mt-2">${func.nome}</h5>
                    <p class="card-text">${func.cargo}</p>
                    <p class="text-muted">Salário: R$ ${func.salario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <p class="text-muted">Admissão: ${new Date(func.admissao).toLocaleDateString('pt-BR')}</p>
                    <p class="text-muted">WhatsApp: ${func.contato ? func.contato : 'Não informado'}</p>
                    ${func.contato ? `<a class="btn btn-success btn-sm mb-2" href="https://wa.me/55${contatoFormatado}" target="_blank"><i class="bi bi-whatsapp"></i> WhatsApp</a>` : ''}
                    <div class="d-grid gap-2">
                        <button class="btn btn-outline-primary btn-sm" onclick="editarFuncionaria(${func.id})">
                            <i class="bi bi-pencil me-1"></i>Editar
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="excluirFuncionaria(${func.id})">
                            <i class="bi bi-trash me-1"></i>Excluir
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}
// Função para salvar serviço/agendamento
function salvarServico() {
    const nome = document.getElementById('nomeServico').value;
    const preco = parseFloat(document.getElementById('precoServico').value);
    const data = document.getElementById('dataAgendamento').value;
    const hora = document.getElementById('horaAgendamento').value;
    const cliente = document.getElementById('clienteServico').value;
    const whatsappCliente = document.getElementById('whatsappClienteServico').value;
    if (nome && preco && data && hora) {
        const servico = {
            id: Date.now(),
            nome: nome,
            preco: preco,
            data: data,
            hora: hora,
            cliente: cliente,
            whatsappCliente: whatsappCliente,
            status: 'agendado'
        };
        dados.servicos.push(servico);
        atualizarListaServicos();
        salvarDados();
        const modal = bootstrap.Modal.getInstance(document.getElementById('servicoModal'));
        modal.hide();
        document.getElementById('formServico').reset();
        alert('Serviço agendado com sucesso!');
    } else {
        alert('Preencha todos os campos obrigatórios!');
    }
}
// Função para dar baixa em um serviço
function darBaixaServico(id) {
    if (confirm('Deseja realmente dar baixa neste serviço?')) {
        const servico = dados.servicos.find(s => s.id === id);
        if (servico) {
            servico.status = 'concluido';
            // Adicionar movimentação automática no caixa
            const movimentacao = {
                id: Date.now(),
                tipo: 'entrada',
                valor: servico.preco,
                descricao: `Serviço concluído: ${servico.nome}`,
                data: new Date().toISOString().split('T')[0],
                hora: new Date().toTimeString().substring(0, 5)
            };
            dados.movimentacoes.push(movimentacao);
            atualizarListaServicos();
            atualizarInterface();
            salvarDados();
            alert('Serviço concluído e movimentação registrada no caixa!');
        }
    }
}
// Função para excluir serviço
function excluirServico(id) {
    if (confirm('Deseja realmente excluir este serviço?')) {
        dados.servicos = dados.servicos.filter(s => s.id !== id);
        atualizarListaServicos();
        atualizarInterface();
        salvarDados();
        alert('Serviço excluído com sucesso!');
    }
}
// Função para mostrar serviços agendados
function atualizarListaServicos() {
    const container = document.getElementById('listaServicos');
    container.innerHTML = '';
    dados.servicos.forEach(serv => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-3';
        const statusClass = serv.status === 'concluido' ? 'bg-success text-white' : 'bg-warning text-dark';
        const statusText = serv.status === 'concluido' ? 'Concluído' : 'Agendado';
        const whatsappBtn = serv.whatsappCliente
            ? `<a class="btn btn-success btn-sm mb-2" href="https://wa.me/55${serv.whatsappCliente.replace(/\D/g,'')}" target="_blank"><i class="bi bi-whatsapp"></i> WhatsApp Cliente</a>`
            : '';
        col.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <h5>${serv.nome}</h5>
                        <span class="badge ${statusClass}">${statusText}</span>
                    </div>
                    <p>Preço: R$ ${serv.preco.toLocaleString('pt-BR')}</p>
                    <p>Data: ${serv.data} ${serv.hora}</p>
                    <p>Cliente: ${serv.cliente || 'Não informado'}</p>
                    ${whatsappBtn}
                    <div class="d-grid gap-2 mt-2">
                        ${serv.status !== 'concluido' ?
                            `<button class="btn btn-success btn-sm" onclick="darBaixaServico(${serv.id})">
                                <i class="bi bi-check-circle"></i> Dar Baixa
                            </button>` : ''}
                        <button class="btn btn-danger btn-sm" onclick="excluirServico(${serv.id})">
                            <i class="bi bi-trash"></i> Excluir
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}
// Função para mostrar salários
function atualizarListaSalarios() {
    const container = document.getElementById('listaSalarios');
    container.innerHTML = '';
    if (!dados.funcionarias.length) {
        container.innerHTML = '<div class="alert alert-warning">Nenhuma funcionária cadastrada.</div>';
        return;
    }
    dados.funcionarias.forEach(func => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-3';
        col.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5>${func.nome}</h5>
                    <p>Cargo: ${func.cargo}</p>
                    <p>Salário: R$ ${func.salario.toLocaleString('pt-BR')}</p>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}
// Função para atualizar o dashboard
function atualizarDashboard() {
    const container = document.getElementById('dashboardContent');
    const totalEntradas = dados.movimentacoes.filter(m => m.tipo === 'entrada').reduce((acc, m) => acc + m.valor, 0);
    const totalSaidas = dados.movimentacoes.filter(m => m.tipo === 'saida').reduce((acc, m) => acc + m.valor, 0);
    const saldo = totalEntradas - totalSaidas;
    const totalFuncionarias = dados.funcionarias.length;
    const totalServicosAgendados = dados.servicos.filter(s => s.status === 'agendado').length;
    const servicosConcluidos = dados.servicos.filter(s => s.status === 'concluido').length;
    container.innerHTML = `
        <div class="col-md-3 mb-3">
            <div class="card stat-card">
                <div class="card-body">
                    <h6 class="card-title">Saldo em Caixa</h6>
                    <h3 class="text-primary">R$ ${saldo.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
                </div>
            </div>
        </div>
        <div class="col-md-3 mb-3">
            <div class="card stat-card">
                <div class="card-body">
                    <h6 class="card-title">Entradas</h6>
                    <h3 class="text-success">R$ ${totalEntradas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
                </div>
            </div>
        </div>
        <div class="col-md-3 mb-3">
            <div class="card stat-card">
                <div class="card-body">
                    <h6 class="card-title">Saídas</h6>
                    <h3 class="text-danger">R$ ${totalSaidas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
                </div>
            </div>
        </div>
        <div class="col-md-3 mb-3">
            <div class="card stat-card">
                <div class="card-body">
                    <h6 class="card-title">Funcionárias</h6>
                    <h3 class="text-info">${totalFuncionarias}</h3>
                </div>
            </div>
        </div>
        <div class="col-md-3 mb-3">
            <div class="card stat-card">
                <div class="card-body">
                    <h6 class="card-title">Serviços Agendados</h6>
                    <h3 class="text-info">${totalServicosAgendados}</h3>
                </div>
            </div>
        </div>
        <div class="col-md-3 mb-3">
            <div class="card stat-card">
                <div class="card-body">
                    <h6 class="card-title">Serviços Concluídos</h6>
                    <h3 class="text-success">${servicosConcluidos}</h3>
                </div>
            </div>
        </div>
    `;
}
// Função para renderizar o calendário
function renderizarCalendario(ano, mes) {
    const calendario = document.getElementById('calendarioServicos');
    const mesAno = document.getElementById('mesAnoAtual');
    // Atualiza o cabeçalho com o mês/ano atual
    const nomesMeses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    mesAno.textContent = `${nomesMeses[mes]} ${ano}`;
    // Limpa o calendário
    calendario.innerHTML = '';
    // Cabeçalhos dos dias da semana
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    diasSemana.forEach(dia => {
        const header = document.createElement('div');
        header.className = 'calendar-header';
        header.textContent = dia;
        calendario.appendChild(header);
    });
    // Primeiro dia do mês
    const primeiroDia = new Date(ano, mes, 1);
    // Último dia do mês
    const ultimoDia = new Date(ano, mes + 1, 0);
    // Dia da semana do primeiro dia (0 = Domingo, 6 = Sábado)
    const primeiroDiaSemana = primeiroDia.getDay();
    // Número de dias no mês
    const diasNoMes = ultimoDia.getDate();
    // Dias do mês anterior visíveis
    const ultimoDiaMesAnterior = new Date(ano, mes, 0).getDate();
    for (let i = primeiroDiaSemana - 1; i >= 0; i--) {
        const dia = document.createElement('div');
        dia.className = 'calendar-day other-month';
        dia.innerHTML = `<div class="calendar-day-number">${ultimoDiaMesAnterior - i}</div>`;
        calendario.appendChild(dia);
    }
    // Dias do mês atual
    for (let i = 1; i <= diasNoMes; i++) {
        const dia = document.createElement('div');
        dia.className = 'calendar-day';
        dia.innerHTML = `<div class="calendar-day-number">${i}</div>`;
        // Adicionar eventos do dia
        const dataAtual = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const servicosDoDia = dados.servicos.filter(s => s.data === dataAtual);
        servicosDoDia.forEach(servico => {
            const evento = document.createElement('div');
            evento.className = 'calendar-event';
            evento.textContent = `${servico.hora} - ${servico.nome}`;
            evento.title = `${servico.nome} - ${servico.cliente || 'Cliente não informado'}`;
            dia.appendChild(evento);
        });
        calendario.appendChild(dia);
    }
    // Dias do próximo mês visíveis
    const totalCelulas = 42; // 6 semanas * 7 dias
    const celulasPreenchidas = primeiroDiaSemana + diasNoMes;
    const diasProximoMes = totalCelulas - celulasPreenchidas;
    for (let i = 1; i <= diasProximoMes; i++) {
        const dia = document.createElement('div');
        dia.className = 'calendar-day other-month';
        dia.innerHTML = `<div class="calendar-day-number">${i}</div>`;
        calendario.appendChild(dia);
    }
}
// Função para mudar o mês no calendário
function mudarMes(delta) {
    mesCalendario += delta;
    if (mesCalendario < 0) {
        mesCalendario = 11;
        anoCalendario--;
    } else if (mesCalendario > 11) {
        mesCalendario = 0;
        anoCalendario++;
    }
    renderizarCalendario(anoCalendario, mesCalendario);
}
// Função para atualizar o relatório
function atualizarRelatorio() {
    filtrarRelatorio();
}
// Função para filtrar o relatório por mês/ano
function filtrarRelatorio() {
    const mes = document.getElementById('mesRelatorio').value;
    const ano = document.getElementById('anoRelatorio').value;
    if (!mes || !ano) {
        document.getElementById('relatorioContent').innerHTML = '<div class="col-12"><div class="alert alert-info">Selecione um mês e ano para visualizar o relatório.</div></div>';
        return;
    }
    // Filtrar movimentações pelo mês e ano
    const movimentacoesFiltradas = dados.movimentacoes.filter(mov => {
        const dataMov = new Date(mov.data);
        return dataMov.getMonth() + 1 === parseInt(mes) && dataMov.getFullYear() === parseInt(ano);
    });
    // Calcular totais
    const entradas = movimentacoesFiltradas.filter(m => m.tipo === 'entrada').reduce((acc, m) => acc + m.valor, 0);
    const saidas = movimentacoesFiltradas.filter(m => m.tipo === 'saida').reduce((acc, m) => acc + m.valor, 0);
    const saldo = entradas - saidas;
    // Renderizar relatório
    const container = document.getElementById('relatorioContent');
    container.innerHTML = `
        <div class="col-md-4 mb-4">
            <div class="card report-card">
                <div class="card-body text-center">
                    <i class="bi bi-arrow-down-circle text-success" style="font-size: 3rem;"></i>
                    <h5 class="mt-3">Entradas</h5>
                    <h3 class="text-success">R$ ${entradas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
                </div>
            </div>
        </div>
        <div class="col-md-4 mb-4">
            <div class="card report-card">
                <div class="card-body text-center">
                    <i class="bi bi-arrow-up-circle text-danger" style="font-size: 3rem;"></i>
                    <h5 class="mt-3">Saídas</h5>
                    <h3 class="text-danger">R$ ${saidas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
                </div>
            </div>
        </div>
        <div class="col-md-4 mb-4">
            <div class="card report-card">
                <div class="card-body text-center">
                    <i class="bi bi-currency-exchange text-primary" style="font-size: 3rem;"></i>
                    <h5 class="mt-3">Saldo</h5>
                    <h3 class="text-primary">R$ ${saldo.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
                </div>
            </div>
        </div>
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h5>Detalhamento de Movimentações - ${getNomeMes(mes)}/${ano}</h5>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Descrição</th>
                                    <th>Tipo</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${movimentacoesFiltradas.map(mov => {
                                    const valorClass = mov.tipo === 'entrada' ? 'text-success' : 'text-danger';
                                    const valorSinal = mov.tipo === 'entrada' ? '+' : '-';
                                    return `
                                        <tr>
                                            <td>${new Date(mov.data).toLocaleDateString('pt-BR')}</td>
                                            <td>${mov.descricao}</td>
                                            <td>${mov.tipo === 'entrada' ? 'Entrada' : 'Saída'}</td>
                                            <td class="${valorClass}">${valorSinal}R$ ${mov.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}
// Função auxiliar para obter nome do mês
function getNomeMes(numeroMes) {
    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return meses[parseInt(numeroMes) - 1];
}
// Atualiza toda a interface
function atualizarInterface() {
    atualizarTabelaCaixa();
    atualizarListaFuncionarias();
    atualizarListaServicos();
    atualizarListaSalarios();
    atualizarDashboard();
    renderizarCalendario(anoCalendario, mesCalendario);
}
// Inicializar data atual nos formulários
window.onload = function() {
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('dataMovimentacao').value = hoje;
    document.getElementById('admissaoFuncionaria').value = hoje;
    document.getElementById('dataAgendamento').value = hoje;
    // Preencher anos no relatório
    const anoSelect = document.getElementById('anoRelatorio');
    const anoAtual = new Date().getFullYear();
    for (let i = anoAtual - 2; i <= anoAtual + 2; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        if (i === anoAtual) option.selected = true;
        anoSelect.appendChild(option);
    }
};
// Tema escuro/claro
document.getElementById('themeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    // Alterna ícone
    const icon = this.querySelector('i');
    if(document.body.classList.contains('dark-mode')) {
        icon.classList.remove('bi-moon');
        icon.classList.add('bi-sun');
    } else {
        icon.classList.remove('bi-sun');
        icon.classList.add('bi-moon');
    }
});
// Salvar dados automaticamente a cada 30 segundos
setInterval(salvarDados, 30000);