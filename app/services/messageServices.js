app.service('messageService', function ($filter) {

	var messages = {
		'success': { title: "SUCESSO", content: "{0}", color: "#739E73", timeout: 5000, icon: "fa fa-check" },
		'warning': { title: "ATENÇÃO", content: "{0}", color: "#C79121", timeout: 5000, icon: "fa fa-exclamation" },
		'error': { title: "OCORREU UM PROBLEMA", content: "{0}", color: "#C36A68", timeout: 15000, icon: "fa fa-exclamation" }
	}

	this.display = function (data, info) {
		return $.smallBox({
			title: messages[data].title,
			content: String.format(messages[data].content, info),
			color: messages[data].color,
			timeout: messages[data].timeout,
			icon: messages[data].icon,
			number: 1
		});
	};

	this.alert = function (data, info) {
		return $.smallBox({
			title: messages[data].title,
			content: String.format(messages[data].content, info),
			color: messages[data].color,
			timeout: messages[data].timeout,
			icon: messages[data].icon
		});
	};

	this.confirmInput = function (content, tipo) {
		if (tipo == 'date')
			return swal({
				title: content,
				showCancelButton: true,
				confirmButtonText: 'Confirmar',
				cancelButtonText: 'Cancelar',
				html:
					'<input id="swal-input-date" type="date" class="swal2-input">',
				preConfirm: () => {
					return document.getElementById('swal-input-date').value;
				}
			}).then(data => {
				return data.value !== true ? data.value : null;
			})
		else
			return swal({
				title: content,
				input: tipo,
				showCancelButton: true,
				confirmButtonText: 'Confirmar',
				cancelButtonText: 'Cancelar',
			}).then(data => {
				return data.value || null
			})
	}

	this.confirm = function (title, content) {
		return swal({
			title: title,
			text: content,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Confirmar',
			cancelButtonText: 'Cancelar'
		})
	}

	this.confirmHTML = function (title, content) {
		return swal({
			title: title,
			html: content,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Confirmar',
			cancelButtonText: 'Cancelar'
		})
	}

	this.restart = function () {
		return $.smallBox({
			title: "Servidor ficará offline.",
			content: "O sistema irá reiniciar em aproximadamente 1 minuto, por favor, salve seus trabalhos e aguarde o retorno do sistema para continuar. <br><br>Obs: Sua tela será recarregada automaticamente quando o servidor voltar.",
			color: '#C36A68',
			timeout: 60000,
			icon: "fa fa-exclamation"
		});
	};

	this.novaVersao = function () {
		return swal({
			title: "Necessário recarregar a página",
			text: "Alguns arquivos foram atualizados e necessitam que sua página seja recarregada, clique em OK e iremos atualiza-los.",
			type: 'warning',
			confirmButtonColor: '#3085d6',
			confirmButtonText: 'OK',
		})
	};

})

// FUNÇÕES
String.format = function () {
	var theString = arguments[0];
	for (var i = 1; i < arguments.length; i++) {
		var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
		theString = theString.replace(regEx, arguments[i]);
	}
	return theString;
};