const numeroSenha = document.querySelector('.parametro-senha__texto');
let tamanhoSenha = 12;
numeroSenha.textContent = tamanhoSenha;

const letrasMaiusculas = 'ABCDEFGHIJKLMNOPQRSTUVXYWZ';
const letrasMinusculas = 'abcdefghijklmnopqrstuvxywz';
const numeros = '0123456789';
const simbolos = '!@%*?';

const botoes = document.querySelectorAll('.parametro-senha__botao');
const campoSenha = document.querySelector('#campo-senha');
const checkbox = document.querySelectorAll('.checkbox');
const forcaSenha = document.querySelector('.forca');
const valorEntropia = document.querySelector('.entropia');

botoes[0].onclick = diminuiTamanho;
botoes[1].onclick = aumentaTamanho;

// NOVO: botão copiar
const botaoCopiar = document.createElement('button');
botaoCopiar.textContent = 'Copiar senha';
botaoCopiar.style.marginTop = '16px';
botaoCopiar.classList.add('parametro-senha__botao'); // usa mesma classe de botão
campoSenha.insertAdjacentElement('afterend', botaoCopiar);
botaoCopiar.addEventListener('click', () => {
    navigator.clipboard.writeText(campoSenha.value);
    botaoCopiar.textContent = 'Copiado!';
    setTimeout(() => botaoCopiar.textContent = 'Copiar senha', 2000);
});

function diminuiTamanho() {
    if (tamanhoSenha > 1) {
        tamanhoSenha--;
        numeroSenha.textContent = tamanhoSenha;
        geraSenha();
    }
}

function aumentaTamanho() {
    if (tamanhoSenha < 20) {
        tamanhoSenha++;
        numeroSenha.textContent = tamanhoSenha;
        geraSenha();
    }
}

checkbox.forEach(cb => cb.addEventListener('click', geraSenha));

geraSenha();

function geraSenha() {
    let alfabeto = '';
    if (checkbox[0].checked) alfabeto += letrasMaiusculas;
    if (checkbox[1].checked) alfabeto += letrasMinusculas;
    if (checkbox[2].checked) alfabeto += numeros;
    if (checkbox[3].checked) alfabeto += simbolos;

    if (alfabeto === '') {
        campoSenha.value = '';
        valorEntropia.textContent = 'Selecione ao menos uma opção!';
        forcaSenha.classList.remove('fraca', 'media', 'forte');
        return;
    }

    let senha = '';
    for (let i = 0; i < tamanhoSenha; i++) {
        const indice = Math.floor(Math.random() * alfabeto.length);
        senha += alfabeto[indice];
    }

    campoSenha.value = senha;
    classificaSenha(alfabeto.length);
}

function classificaSenha(tamanhoAlfabeto) {
    const entropia = tamanhoSenha * Math.log2(tamanhoAlfabeto);
    const dias = Math.floor(2 ** entropia / (100e6 * 60 * 60 * 24)); // tentativa por 100 mi/s

    forcaSenha.classList.remove('fraca', 'media', 'forte');
    let nivel = '';

    if (entropia > 57) {
        forcaSenha.classList.add('forte');
        nivel = 'forte';
    } else if (entropia > 35) {
        forcaSenha.classList.add('media');
        nivel = 'média';
    } else {
        forcaSenha.classList.add('fraca');
        nivel = 'fraca';
    }

    valorEntropia.textContent = `Senha ${nivel}. Um computador pode levar até ${dias} dias para quebrá-la.`;
}