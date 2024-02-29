(self.webpackChunkterra_toolkit=self.webpackChunkterra_toolkit||[]).push([[4580],{36919:function(e,a,o){"use strict";Object.defineProperty(a,"__esModule",{value:!0}),a.messages=a.locale=a.areTranslationsLoaded=void 0;var r,t=o(8604),n=o(48112),i=(r=n)&&r.__esModule?r:{default:r};(0,t.addLocaleData)(i.default);a.areTranslationsLoaded=!0,a.locale="es",a.messages={"Terra.AbstractModal.BeginModalDialog":"Comenzar el diálogo modal","Terra.AbstractModal.EndModalDialog":"Finalizar el diálogo modal","Terra.actionHeader.back":"Retroceder","Terra.actionHeader.close":"Cerrar","Terra.actionHeader.close.description":"Seleccione el botón para cerrar {text}","Terra.actionHeader.maximize":"Maximizar","Terra.actionHeader.maximize.description":"Seleccione el botón para maximizar {text}","Terra.actionHeader.minimize":"Minimizar","Terra.actionHeader.minimize.description":"Seleccione el botón para minimizar {text}","Terra.actionHeader.next":"Siguiente","Terra.actionHeader.previous":"Anterior","Terra.ajax.error":"Error al cargar el contenido.","Terra.avatar.deceased":"Fallecido/a","Terra.form.field.optional":"(opcional)","Terra.form.select.activeOption":"{text} {index} de {totalOptions}.","Terra.form.select.add":'Agregar "{text}"',"Terra.form.select.ariaLabel":"Buscar","Terra.form.select.clearSelect":"Borrar selección","Terra.form.select.collapsed":"Cuadro combinado contraído.","Terra.form.select.defaultComboboxDisplay":"Seleccionar o escribir","Terra.form.select.defaultDisplay":"- Seleccionar -","Terra.form.select.defaultUsageGuidance":"Use las flechas arriba y abajo para desplazarse por las opciones. Presione entrar para seleccionar una opción.","Terra.form.select.dimmed":"Atenuado.","Terra.form.select.disabled":"Deshabilitado.","Terra.form.select.expanded":"Cuadro combinado expandido.","Terra.form.select.listOfTotalOptions":"Lista de opciones.","Terra.form.select.maxSelectionHelp":"Limite los elementos {text}.","Terra.form.select.maxSelectionOption":"Número máximo de elementos {text} seleccionados","Terra.form.select.menu":"Menú","Terra.form.select.mobileButtonUsageGuidance":"Pulse para acceder a las opciones.","Terra.form.select.mobileUsageGuidance":"Deslice a la derecha para acceder a las opciones.","Terra.form.select.multiSelectUsageGuidance":"Escriba texto o use las flechas arriba y abajo para desplazarse por las opciones. Presione entrar para seleccionar o deseleccionar una opción.","Terra.form.select.noResults":'No se encontró ningún resultado que coincida para "{text}"',"Terra.form.select.of":"de","Terra.form.select.optGroup":"Grupo {text}","Terra.form.select.option":"Opciones","Terra.form.select.resultsText":'Resultados que contienen "{text}"',"Terra.form.select.searchUsageGuidance":"Escriba texto o use las flechas arriba y abajo para desplazarse por las opciones. Presione entrar para seleccionar una opción.","Terra.form.select.selectCleared":"Se borró el valor seleccionado","Terra.form.select.selected":"Seleccionado.","Terra.form.select.selectedText":"Se seleccionó {text}. {index} de {totalOptions}.","Terra.form.select.unselected":"No seleccionado.","Terra.form.select.unselectedText":"{text} sin seleccionar.","Terra.hyperlink.iconLabel.audio":"(abre un archivo de audio)","Terra.hyperlink.iconLabel.document":"(abre un documento)","Terra.hyperlink.iconLabel.external":"(abre una página o aplicación externa)","Terra.hyperlink.iconLabel.image":"(abre un archivo de imagen)","Terra.hyperlink.iconLabel.video":"(abre un vídeo)","Terra.icon.IconConsultInstructionsForUse.title":"Icono para instrucciones electrónicas de uso","Terra.list.cancelDrag":"Se canceló el movimiento. El elemento ha vuelto a su posición inicial {startPosition}","Terra.list.drag":"Ha movido el elemento de la posición {startPosition} a la posición {endPosition}","Terra.list.drop":"Ha soltado el elemento. Ha movido el elemento de la posición {startPosition} a {endPosition}","Terra.list.focus":"Presione la barra espaciadora para empezar a arrastrar. Se pueden usar las teclas de flecha para mover el elemento al arrastrar y la tecla Esc para cancelar","Terra.list.lift":"Ha seleccionado un elemento en la posición {startPosition}. Use las teclas de flecha para arrastrar el elemento a una nueva posición. Presione la barra espaciadora para colocar el elemento o presione la tecla Esc para cancelar.","Terra.list.multiSelect":"Lista de selección múltiple: para seleccionar o deseleccionar elementos, pulse Entrar o la barra espaciadora","Terra.list.singleSelect":"Lista de selección individual: para seleccionar o deseleccionar elementos, pulse Entrar o la barra espaciadora","Terra.menu.back":"Retroceder","Terra.menu.close":"Cerrar","Terra.menu.exitSubmenu":",para salir del submenú presione la flecha Izquierda o navegue al botón Volver","Terra.menu.index":"({index} de {totalItems})","Terra.menu.itemWithSubmenu":",con elementos del submenú","Terra.menu.navigateMenuItem":"Para desplazarse por los elementos, presione las flechas arriba y abajo","Terra.menu.selected":",seleccionado","Terra.menu.unselected":",no seleccionado","Terra.notification.dialog.error":"Error","Terra.notification.dialog.hazard-high":"Alerta","Terra.notification.dialog.hazard-low":"Información","Terra.notification.dialog.hazard-medium":"Advertencia","Terra.Overlay.loading":"Cargando...","Terra.popup.header.close":"Cerrar","Terra.searchField.clear":"Borrar","Terra.searchField.search":"Buscar","Terra.searchField.submit-search":"Enviar búsqueda","Terra.slidePanel.defaultPanelLabel":"Panel de detalles","Terra.slidePanel.discloseWarning":"Algunas de las acciones de esta área de contenido pueden originar cambios contextuales en los paneles de detalles.","Terra.status-view.error":"Error","Terra.status-view.no-data":"Sin resultados","Terra.status-view.no-matching-results":"Sin resultados coincidentes","Terra.status-view.not-authorized":"No autorizado","terraApplication.actionMenu.headerCloseButtonLabel":"Cerrar","terraApplication.errorBoundary.defaultErrorMessage":"El sistema detectó un error: {errorDetails}","terraApplication.navigation.drawerMenu.navigation":"Elementos de navegación","terraApplication.navigation.drawerMenu.utilities":"Elementos de utilidades","terraApplication.navigation.extensions.rollupButtonDescription":"Herramientas adicionales","terraApplication.navigation.extensions.rollupMenuHeaderTitle":"Herramientas adicionales","terraApplication.navigation.header.menuButtonTitle":"Menú","terraApplication.navigation.header.skipToContentTitle":"Saltar al contenido","terraApplication.navigation.header.utilityButtonTitleNoUser":"Opciones","terraApplication.navigation.header.utilityButtonTitleUser":"Configuración del usuario para: {currentUserName}","terraApplication.navigation.notifications.new":"Nuevo","terraApplication.navigation.tabs.rollupButtonDescription":"Más opciones de navegación","terraApplication.navigation.tabs.rollupButtonTitle":"Más","terraApplication.navigation.tabs.rollupMenuHeaderTitle":"Más opciones de navegación","terraApplication.navigation.utilityMenu.headerTitle":"Utilidades","terraApplication.navigation.utilityMenu.help":"Ayuda","terraApplication.navigation.utilityMenu.logout":"Cerrar sesión","terraApplication.navigation.utilityMenu.settings":"Configuración","terraApplication.notificationBanner.advisory":"Recomendación.","terraApplication.notificationBanner.alert":"Alerta.","terraApplication.notificationBanner.dismiss":"Descartar","terraApplication.notificationBanner.error":"Error.","terraApplication.notificationBanner.info":"Información.","terraApplication.notificationBanner.success":"Realizado correctamente.","terraApplication.notificationBanner.unsatisfied":"Acción obligatoria.","terraApplication.notificationBanner.unverified":"Historias clínicas externas.","terraApplication.notificationBanner.warning":"Advertencia.","terraApplication.notifications.newNotificationLabel":"Nueva {label} notificación. {bannerType} {bannerDescription}, {bannerAction}, {bannerDismiss}.","terraApplication.notifications.regionLabel":"{label} notificaciones.","terraApplication.notifications.removedNotificationLabel":"Notificación {label} quitada. {bannerType} {bannerDescription}.","terraApplication.notifications.totalCountLabel":"Total {label} de notificaciones: {count}","terraApplication.statusLayout.error":"Error","terraApplication.statusLayout.no-data":"Sin resultados","terraApplication.statusLayout.no-matching-results":"Ningún resultado coincidente","terraApplication.statusLayout.not-authorized":"No autorizado","terraApplication.unsavedChangesPrompt.acceptButtonText":"No guardar","terraApplication.unsavedChangesPrompt.multiplePromptMessageIntro":"Los cambios no guardados se hicieron en:","terraApplication.unsavedChangesPrompt.multiplePromptMessageOutro":"Los cambios se perderán si no los guarda. ¿Qué desea hacer?","terraApplication.unsavedChangesPrompt.rejectButtonText":"Continuar editando","terraApplication.unsavedChangesPrompt.singlePromptMessage":"Se hicieron cambios no guardados en {promptDescription}.","terraApplication.unsavedChangesPrompt.title":"Cambios no guardados","terraApplication.workspace.activityOverlay.loading":"Cargando...","terraApplication.workspace.hideWorkspaceLabel":"Ocultar área de trabajo","terraApplication.workspace.showWorkspaceLabel":"Mostrar área de trabajo","terraApplication.workspace.skipToLabel":"Pasar al Espacio de trabajo","terraApplication.workspace.workspaceLabel":"Área de trabajo","terraApplication.workspace.workspaceSettingsLabel":"Configuración del área de trabajo","terraDevSite.pageActivityOverlayContainer.loading":"Cargando...","terraDevSite.pageHeader.actionsMenu":"{label} Actions","terraDevSite.pageHeader.back":"Retroceder","terraDevSite.pageHeader.moreActions":"More Actions"}},48112:function(e){e.exports=function(){"use strict";return[{locale:"es",pluralRuleFunction:function(e,a){return a?"other":1==e?"one":"other"},fields:{year:{displayName:"año",relative:{0:"este año",1:"el próximo año","-1":"el año pasado"},relativeTime:{future:{one:"dentro de {0} año",other:"dentro de {0} años"},past:{one:"hace {0} año",other:"hace {0} años"}}},"year-short":{displayName:"a",relative:{0:"este año",1:"el próximo año","-1":"el año pasado"},relativeTime:{future:{one:"dentro de {0} a",other:"dentro de {0} a"},past:{one:"hace {0} a",other:"hace {0} a"}}},month:{displayName:"mes",relative:{0:"este mes",1:"el próximo mes","-1":"el mes pasado"},relativeTime:{future:{one:"dentro de {0} mes",other:"dentro de {0} meses"},past:{one:"hace {0} mes",other:"hace {0} meses"}}},"month-short":{displayName:"m",relative:{0:"este mes",1:"el próximo mes","-1":"el mes pasado"},relativeTime:{future:{one:"dentro de {0} m",other:"dentro de {0} m"},past:{one:"hace {0} m",other:"hace {0} m"}}},day:{displayName:"día",relative:{0:"hoy",1:"mañana",2:"pasado mañana","-2":"anteayer","-1":"ayer"},relativeTime:{future:{one:"dentro de {0} día",other:"dentro de {0} días"},past:{one:"hace {0} día",other:"hace {0} días"}}},"day-short":{displayName:"d",relative:{0:"hoy",1:"mañana",2:"pasado mañana","-2":"anteayer","-1":"ayer"},relativeTime:{future:{one:"dentro de {0} día",other:"dentro de {0} días"},past:{one:"hace {0} día",other:"hace {0} días"}}},hour:{displayName:"hora",relative:{0:"esta hora"},relativeTime:{future:{one:"dentro de {0} hora",other:"dentro de {0} horas"},past:{one:"hace {0} hora",other:"hace {0} horas"}}},"hour-short":{displayName:"h",relative:{0:"esta hora"},relativeTime:{future:{one:"dentro de {0} h",other:"dentro de {0} h"},past:{one:"hace {0} h",other:"hace {0} h"}}},minute:{displayName:"minuto",relative:{0:"este minuto"},relativeTime:{future:{one:"dentro de {0} minuto",other:"dentro de {0} minutos"},past:{one:"hace {0} minuto",other:"hace {0} minutos"}}},"minute-short":{displayName:"min",relative:{0:"este minuto"},relativeTime:{future:{one:"dentro de {0} min",other:"dentro de {0} min"},past:{one:"hace {0} min",other:"hace {0} min"}}},second:{displayName:"segundo",relative:{0:"ahora"},relativeTime:{future:{one:"dentro de {0} segundo",other:"dentro de {0} segundos"},past:{one:"hace {0} segundo",other:"hace {0} segundos"}}},"second-short":{displayName:"s",relative:{0:"ahora"},relativeTime:{future:{one:"dentro de {0} s",other:"dentro de {0} s"},past:{one:"hace {0} s",other:"hace {0} s"}}}}},{locale:"es-419",parentLocale:"es"},{locale:"es-AR",parentLocale:"es-419",fields:{year:{displayName:"año",relative:{0:"este año",1:"el próximo año","-1":"el año pasado"},relativeTime:{future:{one:"dentro de {0} año",other:"dentro de {0} años"},past:{one:"hace {0} año",other:"hace {0} años"}}},"year-short":{displayName:"a",relative:{0:"este año",1:"el próximo año","-1":"el año pasado"},relativeTime:{future:{one:"dentro de {0} a",other:"dentro de {0} a"},past:{one:"hace {0} a",other:"hace {0} a"}}},month:{displayName:"mes",relative:{0:"este mes",1:"el próximo mes","-1":"el mes pasado"},relativeTime:{future:{one:"dentro de {0} mes",other:"dentro de {0} meses"},past:{one:"hace {0} mes",other:"hace {0} meses"}}},"month-short":{displayName:"m",relative:{0:"este mes",1:"el próximo mes","-1":"el mes pasado"},relativeTime:{future:{one:"dentro de {0} m",other:"dentro de {0} m"},past:{one:"hace {0} m",other:"hace {0} m"}}},day:{displayName:"día",relative:{0:"hoy",1:"mañana",2:"pasado mañana","-2":"anteayer","-1":"ayer"},relativeTime:{future:{one:"dentro de {0} día",other:"dentro de {0} días"},past:{one:"hace {0} día",other:"hace {0} días"}}},"day-short":{displayName:"d",relative:{0:"hoy",1:"mañana",2:"pasado mañana","-2":"anteayer","-1":"ayer"},relativeTime:{future:{one:"dentro de {0} días",other:"dentro de {0} días"},past:{one:"hace {0} días",other:"hace {0} días"}}},hour:{displayName:"hora",relative:{0:"esta hora"},relativeTime:{future:{one:"dentro de {0} hora",other:"dentro de {0} horas"},past:{one:"hace {0} hora",other:"hace {0} horas"}}},"hour-short":{displayName:"h",relative:{0:"esta hora"},relativeTime:{future:{one:"dentro de {0} h",other:"dentro de {0} h"},past:{one:"hace {0} h",other:"hace {0} h"}}},minute:{displayName:"minuto",relative:{0:"este minuto"},relativeTime:{future:{one:"dentro de {0} minuto",other:"dentro de {0} minutos"},past:{one:"hace {0} minuto",other:"hace {0} minutos"}}},"minute-short":{displayName:"min",relative:{0:"este minuto"},relativeTime:{future:{one:"dentro de {0} min",other:"dentro de {0} min"},past:{one:"hace {0} min",other:"hace {0} min"}}},second:{displayName:"segundo",relative:{0:"ahora"},relativeTime:{future:{one:"dentro de {0} segundo",other:"dentro de {0} segundos"},past:{one:"hace {0} segundo",other:"hace {0} segundos"}}},"second-short":{displayName:"seg.",relative:{0:"ahora"},relativeTime:{future:{one:"dentro de {0} seg.",other:"dentro de {0} seg."},past:{one:"hace {0} seg.",other:"hace {0} seg."}}}}},{locale:"es-BO",parentLocale:"es-419"},{locale:"es-BR",parentLocale:"es-419"},{locale:"es-BZ",parentLocale:"es-419"},{locale:"es-CL",parentLocale:"es-419"},{locale:"es-CO",parentLocale:"es-419"},{locale:"es-CR",parentLocale:"es-419"},{locale:"es-CU",parentLocale:"es-419"},{locale:"es-DO",parentLocale:"es-419",fields:{year:{displayName:"Año",relative:{0:"este año",1:"el próximo año","-1":"el año pasado"},relativeTime:{future:{one:"dentro de {0} año",other:"dentro de {0} años"},past:{one:"hace {0} año",other:"hace {0} años"}}},"year-short":{displayName:"a",relative:{0:"este año",1:"el próximo año","-1":"el año pasado"},relativeTime:{future:{one:"dentro de {0} a",other:"dentro de {0} a"},past:{one:"hace {0} a",other:"hace {0} a"}}},month:{displayName:"Mes",relative:{0:"este mes",1:"el próximo mes","-1":"el mes pasado"},relativeTime:{future:{one:"dentro de {0} mes",other:"dentro de {0} meses"},past:{one:"hace {0} mes",other:"hace {0} meses"}}},"month-short":{displayName:"m",relative:{0:"este mes",1:"el próximo mes","-1":"el mes pasado"},relativeTime:{future:{one:"dentro de {0} m",other:"dentro de {0} m"},past:{one:"hace {0} m",other:"hace {0} m"}}},day:{displayName:"Día",relative:{0:"hoy",1:"mañana",2:"pasado mañana","-2":"anteayer","-1":"ayer"},relativeTime:{future:{one:"dentro de {0} día",other:"dentro de {0} días"},past:{one:"hace {0} día",other:"hace {0} días"}}},"day-short":{displayName:"d",relative:{0:"hoy",1:"mañana",2:"pasado mañana","-2":"anteayer","-1":"ayer"},relativeTime:{future:{one:"dentro de {0} día",other:"dentro de {0} días"},past:{one:"hace {0} día",other:"hace {0} días"}}},hour:{displayName:"hora",relative:{0:"esta hora"},relativeTime:{future:{one:"dentro de {0} hora",other:"dentro de {0} horas"},past:{one:"hace {0} hora",other:"hace {0} horas"}}},"hour-short":{displayName:"h",relative:{0:"esta hora"},relativeTime:{future:{one:"dentro de {0} h",other:"dentro de {0} h"},past:{one:"hace {0} h",other:"hace {0} h"}}},minute:{displayName:"Minuto",relative:{0:"este minuto"},relativeTime:{future:{one:"dentro de {0} minuto",other:"dentro de {0} minutos"},past:{one:"hace {0} minuto",other:"hace {0} minutos"}}},"minute-short":{displayName:"min",relative:{0:"este minuto"},relativeTime:{future:{one:"dentro de {0} min",other:"dentro de {0} min"},past:{one:"hace {0} min",other:"hace {0} min"}}},second:{displayName:"Segundo",relative:{0:"ahora"},relativeTime:{future:{one:"dentro de {0} segundo",other:"dentro de {0} segundos"},past:{one:"hace {0} segundo",other:"hace {0} segundos"}}},"second-short":{displayName:"s",relative:{0:"ahora"},relativeTime:{future:{one:"dentro de {0} s",other:"dentro de {0} s"},past:{one:"hace {0} s",other:"hace {0} s"}}}}},{locale:"es-EA",parentLocale:"es"},{locale:"es-EC",parentLocale:"es-419"},{locale:"es-GQ",parentLocale:"es"},{locale:"es-GT",parentLocale:"es-419"},{locale:"es-HN",parentLocale:"es-419"},{locale:"es-IC",parentLocale:"es"},{locale:"es-MX",parentLocale:"es-419",fields:{year:{displayName:"año",relative:{0:"este año",1:"el año próximo","-1":"el año pasado"},relativeTime:{future:{one:"dentro de {0} año",other:"dentro de {0} años"},past:{one:"hace {0} año",other:"hace {0} años"}}},"year-short":{displayName:"a",relative:{0:"este año",1:"el próximo año","-1":"el año pasado"},relativeTime:{future:{one:"en {0} a",other:"en {0} a"},past:{one:"hace {0} a",other:"hace {0} a"}}},month:{displayName:"mes",relative:{0:"este mes",1:"el mes próximo","-1":"el mes pasado"},relativeTime:{future:{one:"en {0} mes",other:"en {0} meses"},past:{one:"hace {0} mes",other:"hace {0} meses"}}},"month-short":{displayName:"m",relative:{0:"este mes",1:"el próximo mes","-1":"el mes pasado"},relativeTime:{future:{one:"en {0} m",other:"en {0} m"},past:{one:"hace {0} m",other:"hace {0} m"}}},day:{displayName:"día",relative:{0:"hoy",1:"mañana",2:"pasado mañana","-2":"anteayer","-1":"ayer"},relativeTime:{future:{one:"dentro de {0} día",other:"dentro de {0} días"},past:{one:"hace {0} día",other:"hace {0} días"}}},"day-short":{displayName:"d",relative:{0:"hoy",1:"mañana",2:"pasado mañana","-2":"anteayer","-1":"ayer"},relativeTime:{future:{one:"en {0} día",other:"en {0} días"},past:{one:"hace {0} día",other:"hace {0} días"}}},hour:{displayName:"hora",relative:{0:"esta hora"},relativeTime:{future:{one:"dentro de {0} hora",other:"dentro de {0} horas"},past:{one:"hace {0} hora",other:"hace {0} horas"}}},"hour-short":{displayName:"h",relative:{0:"esta hora"},relativeTime:{future:{one:"en {0} h",other:"en {0} n"},past:{one:"hace {0} h",other:"hace {0} h"}}},minute:{displayName:"minuto",relative:{0:"este minuto"},relativeTime:{future:{one:"dentro de {0} minuto",other:"dentro de {0} minutos"},past:{one:"hace {0} minuto",other:"hace {0} minutos"}}},"minute-short":{displayName:"min",relative:{0:"este minuto"},relativeTime:{future:{one:"en {0} min",other:"en {0} min"},past:{one:"hace {0} min",other:"hace {0} min"}}},second:{displayName:"segundo",relative:{0:"ahora"},relativeTime:{future:{one:"dentro de {0} segundo",other:"dentro de {0} segundos"},past:{one:"hace {0} segundo",other:"hace {0} segundos"}}},"second-short":{displayName:"s",relative:{0:"ahora"},relativeTime:{future:{one:"en {0} s",other:"en {0} s"},past:{one:"hace {0} s",other:"hace {0} s"}}}}},{locale:"es-NI",parentLocale:"es-419"},{locale:"es-PA",parentLocale:"es-419"},{locale:"es-PE",parentLocale:"es-419"},{locale:"es-PH",parentLocale:"es"},{locale:"es-PR",parentLocale:"es-419"},{locale:"es-PY",parentLocale:"es-419",fields:{year:{displayName:"año",relative:{0:"este año",1:"el próximo año","-1":"el año pasado"},relativeTime:{future:{one:"dentro de {0} año",other:"dentro de {0} años"},past:{one:"hace {0} año",other:"hace {0} años"}}},"year-short":{displayName:"a",relative:{0:"este año",1:"el próximo año","-1":"el año pasado"},relativeTime:{future:{one:"dentro de {0} a",other:"dentro de {0} a"},past:{one:"hace {0} a",other:"hace {0} a"}}},month:{displayName:"mes",relative:{0:"este mes",1:"el próximo mes","-1":"el mes pasado"},relativeTime:{future:{one:"dentro de {0} mes",other:"dentro de {0} meses"},past:{one:"hace {0} mes",other:"hace {0} meses"}}},"month-short":{displayName:"m",relative:{0:"este mes",1:"el próximo mes","-1":"el mes pasado"},relativeTime:{future:{one:"dentro de {0} m",other:"dentro de {0} m"},past:{one:"hace {0} m",other:"hace {0} m"}}},day:{displayName:"día",relative:{0:"hoy",1:"mañana",2:"pasado mañana","-2":"anteayer","-1":"ayer"},relativeTime:{future:{one:"dentro de {0} día",other:"dentro de {0} días"},past:{one:"hace {0} día",other:"hace {0} días"}}},"day-short":{displayName:"d",relative:{0:"hoy",1:"mañana",2:"pasado mañana","-2":"anteayer","-1":"ayer"},relativeTime:{future:{one:"dentro de {0} día",other:"dentro de {0} días"},past:{one:"hace {0} día",other:"hace {0} días"}}},hour:{displayName:"hora",relative:{0:"esta hora"},relativeTime:{future:{one:"dentro de {0} hora",other:"dentro de {0} horas"},past:{one:"hace {0} hora",other:"hace {0} horas"}}},"hour-short":{displayName:"h",relative:{0:"esta hora"},relativeTime:{future:{one:"dentro de {0} h",other:"dentro de {0} h"},past:{one:"hace {0} h",other:"hace {0} h"}}},minute:{displayName:"minuto",relative:{0:"este minuto"},relativeTime:{future:{one:"dentro de {0} minuto",other:"dentro de {0} minutos"},past:{one:"hace {0} minuto",other:"hace {0} minutos"}}},"minute-short":{displayName:"min",relative:{0:"este minuto"},relativeTime:{future:{one:"dentro de {0} min",other:"dentro de {0} min"},past:{one:"hace {0} min",other:"hace {0} min"}}},second:{displayName:"segundo",relative:{0:"ahora"},relativeTime:{future:{one:"dentro de {0} segundo",other:"dentro de {0} segundos"},past:{one:"hace {0} segundo",other:"hace {0} segundos"}}},"second-short":{displayName:"seg.",relative:{0:"ahora"},relativeTime:{future:{one:"dentro de {0} seg.",other:"dentro de {0} seg."},past:{one:"hace {0} seg.",other:"hace {0} seg."}}}}},{locale:"es-SV",parentLocale:"es-419",fields:{year:{displayName:"año",relative:{0:"este año",1:"el próximo año","-1":"el año pasado"},relativeTime:{future:{one:"dentro de {0} año",other:"dentro de {0} años"},past:{one:"hace {0} año",other:"hace {0} años"}}},"year-short":{displayName:"a",relative:{0:"este año",1:"el próximo año","-1":"el año pasado"},relativeTime:{future:{one:"dentro de {0} a",other:"dentro de {0} a"},past:{one:"hace {0} a",other:"hace {0} a"}}},month:{displayName:"mes",relative:{0:"este mes",1:"el próximo mes","-1":"el mes pasado"},relativeTime:{future:{one:"dentro de {0} mes",other:"dentro de {0} meses"},past:{one:"hace {0} mes",other:"hace {0} meses"}}},"month-short":{displayName:"m",relative:{0:"este mes",1:"el próximo mes","-1":"el mes pasado"},relativeTime:{future:{one:"dentro de {0} m",other:"dentro de {0} m"},past:{one:"hace {0} m",other:"hace {0} m"}}},day:{displayName:"día",relative:{0:"hoy",1:"mañana",2:"pasado mañana","-2":"antier","-1":"ayer"},relativeTime:{future:{one:"dentro de {0} día",other:"dentro de {0} días"},past:{one:"hace {0} día",other:"hace {0} días"}}},"day-short":{displayName:"d",relative:{0:"hoy",1:"mañana",2:"pasado mañana","-2":"anteayer","-1":"ayer"},relativeTime:{future:{one:"dentro de {0} día",other:"dentro de {0} días"},past:{one:"hace {0} día",other:"hace {0} días"}}},hour:{displayName:"hora",relative:{0:"esta hora"},relativeTime:{future:{one:"dentro de {0} hora",other:"dentro de {0} horas"},past:{one:"hace {0} hora",other:"hace {0} horas"}}},"hour-short":{displayName:"h",relative:{0:"esta hora"},relativeTime:{future:{one:"dentro de {0} h",other:"dentro de {0} h"},past:{one:"hace {0} h",other:"hace {0} h"}}},minute:{displayName:"minuto",relative:{0:"este minuto"},relativeTime:{future:{one:"dentro de {0} minuto",other:"dentro de {0} minutos"},past:{one:"hace {0} minuto",other:"hace {0} minutos"}}},"minute-short":{displayName:"min",relative:{0:"este minuto"},relativeTime:{future:{one:"dentro de {0} min",other:"dentro de {0} min"},past:{one:"hace {0} min",other:"hace {0} min"}}},second:{displayName:"segundo",relative:{0:"ahora"},relativeTime:{future:{one:"dentro de {0} segundo",other:"dentro de {0} segundos"},past:{one:"hace {0} segundo",other:"hace {0} segundos"}}},"second-short":{displayName:"s",relative:{0:"ahora"},relativeTime:{future:{one:"dentro de {0} s",other:"dentro de {0} s"},past:{one:"hace {0} s",other:"hace {0} s"}}}}},{locale:"es-US",parentLocale:"es-419",fields:{year:{displayName:"año",relative:{0:"este año",1:"el año próximo","-1":"el año pasado"},relativeTime:{future:{one:"dentro de {0} año",other:"dentro de {0} años"},past:{one:"hace {0} año",other:"hace {0} años"}}},"year-short":{displayName:"a",relative:{0:"este año",1:"el próximo año","-1":"el año pasado"},relativeTime:{future:{one:"dentro de {0} a",other:"dentro de {0} a"},past:{one:"hace {0} a",other:"hace {0} a"}}},month:{displayName:"mes",relative:{0:"este mes",1:"el mes próximo","-1":"el mes pasado"},relativeTime:{future:{one:"dentro de {0} mes",other:"dentro de {0} meses"},past:{one:"hace {0} mes",other:"hace {0} meses"}}},"month-short":{displayName:"m",relative:{0:"este mes",1:"el próximo mes","-1":"el mes pasado"},relativeTime:{future:{one:"dentro de {0} m",other:"dentro de {0} m"},past:{one:"hace {0} m",other:"hace {0} m"}}},day:{displayName:"día",relative:{0:"hoy",1:"mañana",2:"pasado mañana","-2":"anteayer","-1":"ayer"},relativeTime:{future:{one:"dentro de {0} día",other:"dentro de {0} días"},past:{one:"hace {0} día",other:"hace {0} días"}}},"day-short":{displayName:"d",relative:{0:"hoy",1:"mañana",2:"pasado mañana","-2":"anteayer","-1":"ayer"},relativeTime:{future:{one:"dentro de {0} día",other:"dentro de {0} días"},past:{one:"hace {0} día",other:"hace {0} días"}}},hour:{displayName:"hora",relative:{0:"esta hora"},relativeTime:{future:{one:"dentro de {0} hora",other:"dentro de {0} horas"},past:{one:"hace {0} hora",other:"hace {0} horas"}}},"hour-short":{displayName:"h",relative:{0:"esta hora"},relativeTime:{future:{one:"dentro de {0} h",other:"dentro de {0} h"},past:{one:"hace {0} h",other:"hace {0} h"}}},minute:{displayName:"minuto",relative:{0:"este minuto"},relativeTime:{future:{one:"dentro de {0} minuto",other:"dentro de {0} minutos"},past:{one:"hace {0} minuto",other:"hace {0} minutos"}}},"minute-short":{displayName:"min",relative:{0:"este minuto"},relativeTime:{future:{one:"dentro de {0} min",other:"dentro de {0} min"},past:{one:"hace {0} min",other:"hace {0} min"}}},second:{displayName:"segundo",relative:{0:"ahora"},relativeTime:{future:{one:"dentro de {0} segundo",other:"dentro de {0} segundos"},past:{one:"hace {0} segundo",other:"hace {0} segundos"}}},"second-short":{displayName:"s",relative:{0:"ahora"},relativeTime:{future:{one:"dentro de {0} s",other:"dentro de {0} s"},past:{one:"hace {0} s",other:"hace {0} s"}}}}},{locale:"es-UY",parentLocale:"es-419"},{locale:"es-VE",parentLocale:"es-419"}]}()}}]);