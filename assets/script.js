let url = process.env.API_URL || 'http://localhost/api/calculator'
let equation = ''
let user = ''

$(document).ready(() => {
  // define nome do usuário
  $('#username').click()
  $('#confirm_username').click(() => {
    user = $('#username_input').val()
    $('#username').empty().append(user)
  })

  // constrói equação
  const handleInput = (input) => {
    $('#input_equacao').val(input || equation)
  }
  $('.calc div button').click((v) => {
    switch (v.target.textContent) {
      case '=':
        handleEquation()
        break
      case '<':
        equation = equacao.substring(0, equacao.length - 1)
        handleInput()
        break
      case 'AC':
        equation = ''
        handleInput()
        break
      default:
        equation += v.target.textContent
        handleInput()
        break
    }
  })
  //get todas as equações da api
  $('#historico').click(() => {
    $.get(url, (data, status) => {
      if (status === 'success') {
        for (const { usuario, equacao, resultado, criacao } of data) {
          const date = new Date(criacao).toLocaleDateString()
          $('#conteudo_historico').prepend(`
        <span class="text-secondary">${date}</span>
        <div class="row d-flex justify-content-between mb-3">
        <span class="col-2 text-danger ">${usuario}</span>
        <span class="col-6 text-end">${equacao}</span>
        <span class="col-1 ">=</span>
        <span class="col-2 text-start">${resultado}</span>
      </div>`)
        }
      }
    })
  })
  // cuida de fazer o post para a api
  const handleEquation = async () => {
    const data = {
      user,
      equation,
    }
    fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })
      .then((i) => i.json())
      .then((i) => {
        handleInput(i.result)
        $('#resultado').prepend(
          `<div class="text-dark fs-4 text-end w-100">${equation} = ${i.result}</div>`
        )
        equation = ''
      }).catch(() => {handleInput('tente novamente mais tarde')})
  }
})
