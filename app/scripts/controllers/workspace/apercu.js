/* File: apercu.js
 *
 * Copyright (c) 2014
 * Centre National d’Enseignement à Distance (Cned), Boulevard Nicephore Niepce, 86360 CHASSENEUIL-DU-POITOU, France
 * (direction-innovation@cned.fr)
 *
 * GNU Affero General Public License (AGPL) version 3.0 or later version
 *
 * This file is part of a program which is free software: you can
 * redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this program.
 * If not, see <http://www.gnu.org/licenses/>.
 *
 */

/*jshint loopfunc:true*/
/*global $:false, blocks, ownerId, Appversion */

'use strict';

angular.module('cnedApp').controller('ApercuCtrl', function($scope, $rootScope, $http, $window, $location, serviceCheck, configuration, dropbox, removeHtmlTags, verifyEmail, generateUniqueId) {

	$scope.data = [];
	//$scope.blocks = [];
	$scope.blocksAlternative = [];
	$scope.plans = [];
	$scope.showApercu = 'hidden';
	$scope.showPlan = 'visible';
	$scope.counterElements = 0;
	$scope.styleParagraphe = '';
	/* activer le loader */
	$scope.loader = false;
	$scope.showDuplDocModal = false;
	$scope.showRestDocModal = false;
	$scope.showDestination = false;
	$scope.showEmail = false;
	$scope.emailMsgSuccess = '';
	$scope.emailMsgError = '';
	$scope.escapeTest = true;
	$scope.showPartagerModal = true;
	$scope.isEnableNoteAdd = false;
	// $scope.volume = 0.5;
	var numNiveau = 0;
	$rootScope.restructedBlocks = null;
	$scope.printPlan = true;

	$('#main_header').show();
	$('#titreDocument').hide();
	$('#detailProfil').hide();
	$scope.testEnv = false;
	$scope.pasteNote = false;

	/* Mette à jour dernier document affiché */
	if ($location.absUrl()) {
		localStorage.setItem('lastDocument', $location.absUrl());
		$scope.encodeURI = encodeURIComponent($location.absUrl());
	}

	$scope.requestToSend = {};
	if (localStorage.getItem('compteId')) {
		$scope.requestToSend = {
			id: localStorage.getItem('compteId')
		};
	}

	$scope.showTitleDoc = function() {
		var docUrl = decodeURI($location.absUrl());
		docUrl = docUrl.replace('#/apercu', '');
		$rootScope.titreDoc = decodeURIComponent(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent(docUrl))[0].replace('_', '').replace('_', ''));
		var docName = decodeURI(docUrl.substring(docUrl.lastIndexOf('/') + 1, docUrl.lastIndexOf('.html')));
		$scope.docSignature = /((_)([A-Za-z0-9_%]+))/i.exec(encodeURIComponent(docName))[0].replace(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent(docName))[0], '');
		$('#titreDocumentApercu').show();
	};
	$scope.showTitleDoc();

	$scope.populateApercu = function() {
		// Selection des profils tags pour le style
		if (blocks && blocks.children.length > 0) {
			//if (localStorage.getItem('listTagsByProfil')) {
			$scope.profiltags = JSON.parse(localStorage.getItem('listTagsByProfil'));
			//Selection des tags pour le plan
			//if (localStorage.getItem('listTags')) {
			$scope.tags = JSON.parse(localStorage.getItem('listTags'));
			var blocksArray = angular.fromJson(blocks);
			$scope.blocksPlan = [];
			$scope.blocksPlan[0] = [];
			$scope.blocksPlan[0][0] = [];
			$scope.idx2 = [];

			/* Initialisation du style des annotations */
			initStyleAnnotation();

			for (var i = 0; i < blocksArray.children.length; i++) {
				$scope.blocksPlan[i + 1] = [];
				$scope.idx2[i + 1] = 0;
				//$scope.blocksPlan[i + 1][j] = blocksArray.children[i];
				blocksArray.children[i].root = true;
				traverseRoot(blocksArray.children[i], i);
				traverseLeaf(blocksArray.children[i].children, i);
			}

			$scope.plans.forEach(function(entry) {
				entry.style = '<p ' + $scope.styleParagraphe + '> ' + entry.libelle + ' </p>';
			});

			$scope.pagePrints = [];
			for (var k = 0; k < $scope.blocksPlan.length - 1; k++) {
				$scope.pagePrints.push(k + 1);
			}

			$scope.loader = false;
		}
	};

	$scope.verifProfil = function() {
		$scope.sentVar = {
			userID: $rootScope.currentUser._id,
			actuel: true
		};
		$scope.token.getActualProfile = $scope.sentVar;
		$http.post(configuration.URL_REQUEST + '/chercherProfilActuel', $scope.token)
			.success(function(dataActuel) {
				$scope.varToSend = {
					profilID: dataActuel.profilID
				};
				localStorage.setItem('profilActuel', JSON.stringify(dataActuel));
				$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
					idProfil: dataActuel.profilID
				}).success(function(data) {
					localStorage.setItem('listTagsByProfil', JSON.stringify(data));
					$http.get(configuration.URL_REQUEST + '/readTags', {
						params: $scope.requestToSend
					}).success(function(data) {
						localStorage.setItem('listTags', JSON.stringify(data));
						$scope.populateApercu();
					});
				});
			});
	};

	$scope.defaultProfile = function() {
		$http.post(configuration.URL_REQUEST + '/chercherProfilParDefaut')
			.success(function(data) {
				if (data) {
					$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
						idProfil: data.profilID
					}).success(function(data) {
						localStorage.setItem('listTagsByProfil', JSON.stringify(data));
						$http.get(configuration.URL_REQUEST + '/readTags', {
							params: $scope.requestToSend
						}).success(function(data) {
							localStorage.setItem('listTags', JSON.stringify(data));
							$scope.populateApercu();
						});
					});
				}
			});
	};

	$scope.init = function() {

		// var testUrl= decodeURIComponent(/(([0-9]+)(-)([0-9]+)(-)([0-9]+)(_+)([A-Za-z0-9_%]*)(.html))/i.exec(encodeURIComponent($location.absUrl()))[0]);
		// console.log('====>');
		// console.log(testUrl);
		if ($location.absUrl().indexOf('key=') > -1) {
			var callbackKey = $location.absUrl().substring($location.absUrl().indexOf('key=') + 4, $location.absUrl().length);
			localStorage.setItem('compteId', callbackKey);
		}

		if ($scope.testEnv === false) {
			$scope.browzerState = navigator.onLine;
		} else {
			$scope.browzerState = true;
		}

		if (!$scope.browzerState) {
			console.log('you are offline');
			$scope.showPartagerModal = false;
			if (localStorage.getItem('listTagsByProfil') && localStorage.getItem('listTags')) {
				console.log('starting populate');
				$scope.populateApercu();
			}
			return;
		}

		if (!localStorage.getItem('compteId') && localStorage.getItem('listTagsByProfil') && localStorage.getItem('listTags')) {
			$scope.populateApercu();
		} else if (localStorage.getItem('compteId')) {
			var tmp = serviceCheck.getData();
			tmp.then(function(result) {
				if (result.loged) {
					$rootScope.currentUser = result.user;
					console.log($rootScope.currentUser);
					if (ownerId && ownerId !== $rootScope.currentUser._id) {
						$scope.newOwnerId = $rootScope.currentUser._id;
						$scope.showDuplDocModal = true;
						var docUrl = decodeURI($location.absUrl());
						docUrl = docUrl.replace('#/apercu', '');
						$scope.duplDocTitre = decodeURIComponent(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent(docUrl))[0].replace('_', '').replace('_', ''));
					}

					if ($rootScope.currentUser) {
						$scope.showEmail = true;
					}

					if (ownerId && ownerId === $rootScope.currentUser._id) {
						$scope.showRestDocModal = true;

						//starting upgrade service
						$http.post(configuration.URL_REQUEST + '/allVersion', {
							id: $rootScope.currentUser.local.token
						})
							.success(function(dataRecu) {
								console.log('succeeeees');
								console.log(dataRecu);
								if (dataRecu.length !== 0) {
									if (Appversion !== '' + dataRecu[0].appVersion + '') {
										console.log('different');
										$scope.newAppVersion = dataRecu[0].appVersion;
										$('#updateVersionModal').modal('show');
									} else {
										console.log('les meme');
									}
								}
							}).error(function() {
								console.log('erreur cheking version');
							});
					}
					$scope.token = {
						id: $rootScope.currentUser.local.token
					};

					if (localStorage.getItem('listTagsByProfil') && localStorage.getItem('listTags')) {
						$scope.populateApercu();
					} else {
						$scope.verifProfil();
					}
				} else {
					$scope.defaultProfile();
				}

			});
		} else {
			$scope.defaultProfile();
		}
	};

	$scope.init();

	function limitParagraphe(titre) {
		var taille = 0;
		var limite = 80;

		if (titre.length <= limite) {
			return titre;
		}

		for (var i = 0; i < titre.length; i++) {
			taille = taille + 1;
			if (taille >= limite) {
				break;
			}
		}
		return titre.substring(0, taille) + '...';
	}

	function getTagById(idTag) {
		for (var i = 0; i < $scope.tags.length; i++) {
			if (idTag === $scope.tags[i]._id) {
				return $scope.tags[i];
			}
		}
	}

	function initStyleAnnotation() {
		for (var profiltag in $scope.profiltags) {
			var style = $scope.profiltags[profiltag].texte;
			var currentTag = getTagById($scope.profiltags[profiltag].tag);
			if (currentTag && currentTag.libelle.toUpperCase().match('^ANNOTATION')) {
				console.warn('libelle ==>', currentTag.libelle);
				$scope.styleAnnotation = style.substring(style.indexOf('<p') + 2, style.indexOf('>'));
				break;
			}
		}
	}

	function applyRegleStyle(block, idx1) {
		var counterElement = $scope.counterElements;
		var debutStyle = '<p id="' + counterElement + '">';
		var finStyle = '</p>';
		var tagExist = false;
		var libelle = '';
		var numNiveauTmp = numNiveau;
		var isTitre = false;

		for (var profiltag in $scope.profiltags) {
			/* le cas d'un paragraphe */
			var style = $scope.profiltags[profiltag].texte;
			var currentTag = getTagById($scope.profiltags[profiltag].tag);
			if (currentTag) {
				libelle = currentTag.libelle; //$scope.profiltags[profiltag].tagName;
			} else {
				libelle = '';
			}

			if (libelle.match('^Normal')) {
				$scope.styleParagraphe = style.substring(style.indexOf('<p') + 2, style.indexOf('>'));
			}

			if (block.tag === $scope.profiltags[profiltag].tag) {
				debutStyle = style.substring(style.indexOf('<p'), style.indexOf('>')) + 'id="' + counterElement + '" regle-style="" >';
				if (currentTag && currentTag.niveau && parseInt(currentTag.niveau) > 0) {
					numNiveau = parseInt(currentTag.niveau);
					numNiveauTmp = numNiveau;
					numNiveau++;
				}
				/* le cas d'un titre */
				if (libelle.match('^Titre')) {
					libelle = block.text;
					isTitre = true;
				}
				tagExist = true;
				break;
			}
		}

		// Selection du Tag si il n'existe pas sur les profilsTags
		if (!tagExist) {
			for (var i = 0; i < $scope.tags.length; i++) {
				if (block.tag === $scope.tags[i]._id) {
					libelle = $scope.tags[i].libelle;
					if ($scope.tags[i].niveau && parseInt($scope.tags[i].niveau) > 0) {
						numNiveau = parseInt($scope.tags[i].niveau);
						numNiveauTmp = numNiveau;
						numNiveau++;
					}
					if (libelle.match('^Titre')) {
						libelle = block.text;
						isTitre = true;
					}
					break;
				}
			}
		}

		if (!isTitre) {
			libelle = removeHtmlTags(libelle) + ' : ' + limitParagraphe(removeHtmlTags(block.text)).replace(/\n/g, ' ');
		} else {
			libelle = removeHtmlTags(libelle);
		}

		if (block.tag && block.tag.length > 0) {
			$scope.plans.push({
				libelle: libelle,
				block: block.id,
				position: idx1,
				numNiveau: numNiveauTmp
			});
		}

		block.text = debutStyle + block.text + finStyle;

		return block;
	}

	/* Parcourir les blocks du document d'une facon recursive */

	function traverseLeaf(obj, idx1) {
		for (var key in obj) {
			if (typeof(obj[key]) === 'object') {
				if (obj[key].text && obj[key].text.length > 0) {
					$scope.counterElements += 1;
					obj[key] = applyRegleStyle(obj[key], idx1);
				}
				$scope.idx2[idx1 + 1] = $scope.idx2[idx1 + 1] + 1;
				$scope.blocksPlan[idx1 + 1][$scope.idx2[idx1 + 1]] = obj[key];

				if (obj[key].children && obj[key].children.length > 0) {
					traverseLeaf(obj[key].children, idx1);
				} else {
					obj[key].leaf = true;
				}
			}
		}
	}

	function traverseRoot(obj, idx1) {
		if (obj.text && obj.text.length > 0 && obj.children.length <= 0) {
			$scope.counterElements += 1;
			obj = applyRegleStyle(obj, idx1);
		}
		$scope.blocksPlan[idx1 + 1][$scope.idx2[idx1 + 1]] = obj;
	}

	$scope.calculateNiveauPlan = function(nNiv) {
		var marginLeft = 0;
		if (parseInt(nNiv) > 1) {
			marginLeft = (parseInt(nNiv) - 1) * 30;
		}
		return marginLeft;
	};

	/* Aller au Slide de position idx et du block blk */
	$scope.setActive = function(idx, blk) {
		$rootScope.currentIndexPage = idx + 1;
		$scope.blocksPlan[idx + 1].active = true;
		$scope.currentBlock = blk;
		$scope.showApercu = 'visible';
		$scope.showPlan = 'hidden';
	};

	/* Interception de l'evenement goToArea de la fin de la transition */
	$scope.$on('goToBlockSlide', function() {
		console.log('goToBlockSlide ==>');
		$scope.restoreNotesStorage($rootScope.currentIndexPage);

		var blockId = '#' + $scope.currentBlock;
		if ($scope.currentBlock && $(blockId).offset()) {
			$('html, body').animate({
				scrollTop: $(blockId).offset().top
			}, 1200);
			$scope.currentBlock = null;
		} else {
			if ($('#plan').offset()) {
				$('html, body').animate({
					scrollTop: $('#plan').offset().top
				}, 500);
			}
		}
	});

	/* Si la fin de l'affichage de l'apercu */
	$scope.$on('ngRepeatFinishedApercu', function() {
		$('.toAddItem').addClass('item');
	});

	// Catch detection of key up
	// $scope.$on('keydown', function(msg, code) {
	// if (code === 37) {
	// $scope.$broadcast('prevSlide');
	// } else if (code === 39) {
	// $scope.$broadcast('nextSlide');
	// }
	// });

	/*$scope.initPlayerAudio = function() {
		console.log("ng initialised");
		// Initialiser le lecteur audio
		audiojs.events.ready(function() {
			console.log('ng initialised 1.1 ');
			var as = audiojs.createAll();
		});
		var players = document.getElementsByClassName("player-audio");
		console.log(players);
		players.load();
	};*/

	$scope.playSong = function(source) {
		var audio = document.getElementById('player');
		audio.setAttribute('src', source);
		audio.load();
		audio.play();

		/*audiojs.events.ready(function() {
			console.log('ng initialised 1.1 ');
			var as = audiojs.createAll();
			as.play();
		});*/
	};

	$scope.pauseAudio = function() {
		var audio = document.getElementById('player');
		if (audio) {
			audio.pause();
		}
	};

	/*$scope.volumeChanged = function() {
		console.log('volumeChanged ==> ');
		console.log($scope.volume);
		var audio = document.getElementById('player');
		if(audio) {
			console.log(audio.volume);
		}
	};*/

	/* Afficher/Masquer le menu escamotable */
	$scope.afficherMenu = function() {
		if ($('.open_menu').hasClass('shown')) {
			$('.open_menu').removeClass('shown');
			$('.open_menu').parent('.menu_wrapper').animate({
				'margin-left': '160px'
			}, 100);
			$('.zoneID').css('z-index', '9');

		} else {
			$('.open_menu').addClass('shown');
			$('.open_menu').parent('.menu_wrapper').animate({
				'margin-left': '0'
			}, 100);
			$('.zoneID').css('z-index', '8');
		}
	};

	/* Aller au precedent */
	$scope.precedent = function() {
		$scope.$broadcast('prevSlide');
	};

	/* Aller au suivant */
	$scope.suivant = function() {
		$scope.$broadcast('nextSlide');
	};

	/* Aller au dernier */
	$scope.dernier = function() {
		if ($scope.blocksPlan.length > 0) {
			$rootScope.currentIndexPage = $scope.blocksPlan.length - 1;
			$scope.blocksPlan[$scope.blocksPlan.length - 1].active = true;
		}
	};

	/* Aller au premier */
	$scope.premier = function() {
		if ($scope.blocksPlan.length === 1) {
			$rootScope.currentIndexPage = 0;
			$scope.blocksPlan[0].active = true;
		} else if ($scope.blocksPlan.length > 1) {
			$rootScope.currentIndexPage = 1;
			$scope.blocksPlan[1].active = true;
		}
	};


	/* Aller au plan */
	$scope.plan = function() {
		if ($scope.blocksPlan.length > 0) {
			$rootScope.currentIndexPage = 0;
			$scope.blocksPlan[0].active = true;
			if ($('#plan').offset()) {
				$('html, body').animate({
					scrollTop: $('#plan').offset().top
				}, 500);
			}
		}
	};

	/* Fixer/Défixer le menu lors du défilement */
	$(window).scroll(function() {
		var dif_scroll = 0;
		if ($('.carousel-inner').offset()) {

			if ($(window).scrollTop() >= $('.carousel-inner').offset().top) {
				dif_scroll = $(window).scrollTop() - 160;
				$('.fixed_menu').css('top', dif_scroll + 'px');
			} else {
				$('.fixed_menu').css('top', 0);
			}
		}

	});

	$scope.restructurer = function() {
		if (blocks && blocks.children.length > 0) {
			$rootScope.restructedBlocks = blocks;
			var urlAp = $location.absUrl();
			urlAp = urlAp.replace('#/apercu', '');
			$rootScope.docTitre = decodeURI(urlAp.substring(urlAp.lastIndexOf('/') + 1, urlAp.lastIndexOf('.html')));
			if ($scope.escapeTest) {
				$window.location.href = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'workspace';
			}
		}
	};

	$scope.loadMail = function() {
		$scope.showDestination = true;
	};

	$scope.clearSocialShare = function() {
		$scope.confirme = false;
		$scope.showDestination = false;
		$scope.destinataire = '';
	};

	$scope.dismissConfirm = function() {
		$scope.destinataire = '';
	};

	/*envoi de l'email au destinataire*/
	$scope.sendMail = function() {
		$('#confirmModal').modal('hide');
		var docApartager = $scope.encodeURI;
		$scope.loader = true;
		if ($rootScope.currentUser.dropbox.accessToken) {
			if (configuration.DROPBOX_TYPE) {
				if ($rootScope.currentUser && docApartager) {
					$scope.sharedDoc = decodeURIComponent(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent(docApartager))[0].replace('_', '').replace('_', ''));
					$scope.sendVar = {
						to: $scope.destinataire,
						content: ' a utilisé cnedAdapt pour partager un fichier avec vous !  ' + $scope.sharedDoc,
						encoded: '<span> vient d\'utiliser CnedAdapt pour partager un fichier avec vous !   <a href=\'' + $location.absUrl() + '\'>' + $scope.sharedDoc + '</a> </span>',
						prenom: $rootScope.currentUser.local.prenom,
						fullName: $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom,
						doc: $scope.sharedDoc
					};
					$http.post(configuration.URL_REQUEST + '/sendMail', $scope.sendVar)
						.success(function() {
							//$('#okEmail').fadeIn('fast').delay(5000).fadeOut('fast');
							//$scope.sent = data;
							//$scope.envoiMailOk = true;
							$scope.destinataire = '';
							$scope.loader = false;
							$scope.showDestination = false;
							// $('#shareModal').modal('hide');
						});
				}
			}
		}
	};

	$scope.socialShare = function() {
		$scope.emailMsgSuccess = '';
		$scope.emailMsgError = '';

		if (!$scope.destinataire || $scope.destinataire.length <= 0) {
			$scope.emailMsgError = 'L\'Email est obligatoire!';
			return;
		}
		if (!verifyEmail($scope.destinataire)) {
			$scope.emailMsgError = 'L\'Email est invalide!';
			return;
		}
		$('#confirmModal').modal('show');
		$('#shareModal').modal('hide');

	};

	$scope.clearDupliquerDocument = function() {
		$scope.showMsgSuccess = false;
		$scope.showMsgError = false;
		$scope.msgSuccess = '';
		$scope.showMsgError = '';
		var docUrl = decodeURI($location.absUrl());
		docUrl = docUrl.replace('#/apercu', '');
		$scope.duplDocTitre = decodeURIComponent(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent(docUrl))[0].replace('_', '').replace('_', ''));
		$('#duplicateDocModal').modal('hide');
	};

	$scope.dupliquerDocument = function() {
		if ($rootScope.currentUser) {
			$('.loader_cover').show();
			$scope.loaderProgress = 10;
			$scope.showloaderProgress = true;
			$scope.loaderMessage = 'Copie du document dans votre DropBox en cours. Veuillez patienter ...';

			var token = $rootScope.currentUser.dropbox.accessToken;
			var newOwnerId = $rootScope.currentUser._id;
			var url = $location.absUrl();
			url = url.replace('#/apercu', '');
			var filePreview = url.substring(url.lastIndexOf('_') + 1, url.lastIndexOf('.html'));
			var newDocName = $scope.duplDocTitre;
			var manifestName = newDocName + '_' + filePreview + '.appcache';
			var apercuName = newDocName + '_' + filePreview + '.html';
			var listDocumentDropbox = configuration.CATALOGUE_NAME;
			$scope.loader = true;
			var msg1 = 'Le document est copié avec succès !';
			var errorMsg1 = 'Le nom du document existe déja dans votre Dropbox !';
			var errorMsg2 = 'Le titre est obligatoire !';
			$scope.msgErrorModal = '';
			$scope.msgSuccess = '';
			$scope.showMsgSuccess = false;
			$scope.showMsgError = false;
			$('#duplDocButton').attr('data-dismiss', 'modal');

			if (!$scope.duplDocTitre || $scope.duplDocTitre.length <= 0) {
				$scope.msgErrorModal = errorMsg2;
				$scope.showMsgError = true;
				$scope.loader = false;
				$scope.showloaderProgress = false;
				$('#duplDocButton').attr('data-dismiss', '');
				return;
			}

			if (!serviceCheck.checkName($scope.duplDocTitre)) {
				$scope.msgErrorModal = 'Veuillez n\'utiliser que des lettres (de a à z) et des chiffres.';
				$scope.loader = false;
				$scope.showMsgError = true;
				$scope.showloaderProgress = false;
				$('#duplDocButton').attr('data-dismiss', '');
				return;
			}

			var searchApercu = dropbox.search('_' + $scope.duplDocTitre + '_', token, configuration.DROPBOX_TYPE);
			searchApercu.then(function(result) {
				$scope.loaderProgress = 30;
				if (result && result.length > 0) {
					$scope.showMsgError = true;
					$scope.msgErrorModal = errorMsg1;
					$scope.showloaderProgress = false;
					$scope.loaderProgress = 100;
					$scope.loader = false;
					$('#duplDocButton').attr('data-dismiss', '');
					$('#duplicateDocModal').modal('show');
				} else {
					var dateDoc = new Date();
					dateDoc = dateDoc.getFullYear() + '-' + (dateDoc.getMonth() + 1) + '-' + dateDoc.getDate();
					apercuName = dateDoc + '_' + apercuName;
					manifestName = dateDoc + '_' + manifestName;

					$http.get(configuration.URL_REQUEST + '/listDocument.appcache').then(function(response) {
						var uploadManifest = dropbox.upload(($scope.manifestName || manifestName), response.data, token, configuration.DROPBOX_TYPE);
						uploadManifest.then(function(result) {
							$scope.loaderProgress = 50;
							if (result) {
								var shareManifest = dropbox.shareLink(($scope.manifestName || manifestName), token, configuration.DROPBOX_TYPE);
								shareManifest.then(function(result) {
									$scope.loaderProgress = 70;
									if (result) {
										var urlManifest = result.url;
										$http.get(($scope.url || url)).then(function(resDocDropbox) {
											$scope.loaderProgress = 80;
											var docDropbox = resDocDropbox.data;
											docDropbox = docDropbox.replace(docDropbox.substring(docDropbox.indexOf('manifest="'), docDropbox.indexOf('.appcache"') + 10), 'manifest="' + urlManifest + '"');
											docDropbox = docDropbox.replace('ownerId = \'' + ownerId + '\'', 'ownerId = \'' + newOwnerId + '\'');

											var uploadApercu = dropbox.upload(($scope.apercuName || apercuName), docDropbox, token, configuration.DROPBOX_TYPE);
											uploadApercu.then(function(result) {
												$scope.loaderProgress = 85;
												var listDocument = result;
												var shareApercu = dropbox.shareLink(($scope.apercuName || apercuName), token, configuration.DROPBOX_TYPE);
												shareApercu.then(function(result) {
													$scope.loaderProgress = 90;
													if (result) {
														$scope.docTitre = '';
														var urlDropbox = result.url + '#/apercu';
														console.log(urlDropbox);
														listDocument.lienApercu = result.url + '#/apercu';
														var downloadDoc = dropbox.download(($scope.listDocumentDropbox || listDocumentDropbox), token, configuration.DROPBOX_TYPE);
														downloadDoc.then(function(result) {
															$scope.loaderProgress = 92;
															var debut = result.indexOf('var listDocument') + 18;
															var fin = result.indexOf(']', debut) + 1;
															var curentListDocument = result.substring(debut + 1, fin - 1);
															if (curentListDocument.length > 0) {
																curentListDocument = curentListDocument + ',';
															}
															result = result.replace(result.substring(debut, fin), '[]');
															result = result.replace('listDocument= []', 'listDocument= [' + curentListDocument + angular.toJson(listDocument) + ']');
															var uploadDoc = dropbox.upload(($scope.listDocumentDropbox || listDocumentDropbox), result, token, configuration.DROPBOX_TYPE);
															uploadDoc.then(function() {
																$scope.loaderProgress = 94;
																var downloadManifest = dropbox.download('listDocument.appcache', token, configuration.DROPBOX_TYPE);
																downloadManifest.then(function(dataFromDownload) {
																	$scope.loaderProgress = 96;
																	var newVersion = parseInt(dataFromDownload.charAt(29)) + 1;
																	dataFromDownload = dataFromDownload.replace(':v' + dataFromDownload.charAt(29), ':v' + newVersion);
																	var uploadManifest = dropbox.upload('listDocument.appcache', dataFromDownload, token, configuration.DROPBOX_TYPE);
																	uploadManifest.then(function() {
																		$scope.loaderProgress = 100;
																		$scope.showloaderProgress = false;
																		$scope.loader = false;
																		$scope.showMsgSuccess = true;
																		$scope.msgSuccess = msg1;
																		$('#duplDocButton').attr('data-dismiss', '');
																		$('#duplicateDocModal').modal('show');
																	});
																});
															});
														});
													}
												});
											});

										});
									}
								});
							}
						});

					});

				}
			});


		}
	};

	$scope.selectionnerMultiPage = function() {
		$scope.pageA = 1;
		$scope.pageDe = 1;
		$('select[data-ng-model="pageDe"] + .customSelect .customSelectInner,select[data-ng-model="pageA"] + .customSelect .customSelectInner').text('1');
	};

	$scope.selectionnerPageDe = function() {
		$('select[data-ng-model="pageA"] + .customSelect .customSelectInner').text($scope.pageDe);
		var pageDe = parseInt($scope.pageDe);
		$('select[data-ng-model="pageA"] option').prop('disabled', false);
		for (var i = 0; i < pageDe - 1; i++) {
			$('select[data-ng-model="pageA"] option').eq(i).prop('disabled', true);
		}
	};

	$scope.printByMode = function() {

		if ($location.absUrl()) {
			var printURL = decodeURI($location.absUrl());
			printURL = printURL.replace('#/apercu', '');
			var printP = 0;
			if ($scope.printPlan === true) {
				printP = 1;
			}
			printURL = printURL + '#/print?plan=' + printP + '&mode=' + $scope.printMode;
			if ($scope.printMode) {
				if ($scope.printMode === 1) {
					printURL = printURL + '&de=' + $rootScope.currentIndexPage + '&a=' + $rootScope.currentIndexPage;
				} else if ($scope.printMode === 2) {
					printURL = printURL + '&de=' + $scope.pageDe + '&a=' + $scope.pageA;
				}
			}
			$window.open(printURL);
		}
	};

	/* Debut Gestion des notes dans l'apercu */
	$scope.notes = [];

	$scope.drawLine = function() {
		$('#noteBlock1 div').remove();
		if ($scope.notes.length > 0) {
			for (var i = 0; i < $scope.notes.length; i++) {
				$('#noteBlock1').line($scope.notes[i].xLink + 65, $scope.notes[i].yLink + 25, $scope.notes[i].x, $scope.notes[i].y + 20, {
					color: '#747474',
					stroke: 1,
					zindex: 10
				});
			}
		}
	};

	$scope.restoreNotesStorage = function(idx) {
		if (idx && idx !== 0 && localStorage.getItem('notes')) {
			var notes = JSON.parse(angular.fromJson(localStorage.getItem('notes')));
			$scope.notes = [];
			for (var i = 0; i < notes.length; i++) {
				if (notes[i].idDoc === $scope.docSignature && notes[i].idPage === idx) {
					notes[i].styleNote = '<p ' + $scope.styleAnnotation + '> ' + notes[i].texte + ' </p>';
					$scope.notes.push(notes[i]);
				}
			}
		} else {
			$scope.notes = [];
		}
		$scope.drawLine();
	};

	function getNoteNextID() {
		if (!$scope.notes.length) {
			return (1);
		}
		var lastNote = $scope.notes[$scope.notes.length - 1];
		return (lastNote.idInPage + 1);
	}

	$scope.addNote = function(x, y) {
		var idNote = generateUniqueId();
		var idInPage = getNoteNextID();
		var defaultX = $('.carousel-caption').width() + 100;
		//var defaultW = defaultX + $('#noteBlock2').width();
		var newNote = {
			idNote: idNote,
			idInPage: idInPage,
			idDoc: $scope.docSignature,
			idPage: $rootScope.currentIndexPage,
			texte: 'Note ' + idInPage,
			x: defaultX,
			y: y,
			xLink: x,
			yLink: y
		};

		newNote.styleNote = '<p ' + $scope.styleAnnotation + '> ' + newNote.texte + ' </p>';

		$scope.notes.push(newNote);
		$scope.drawLine();

		var notes = [];
		if (localStorage.getItem('notes')) {
			notes = JSON.parse(angular.fromJson(localStorage.getItem('notes')));
		}
		notes.push(newNote);
		localStorage.setItem('notes', JSON.stringify(angular.toJson(notes)));
	};

	$scope.removeNote = function(note) {
		console.log('removeNote');
		console.log(note);
		console.log($scope.notes);
		var index = $scope.notes.indexOf(note);
		$scope.notes.splice(index, 1);
		$scope.drawLine();

		var notes = [];
		if (localStorage.getItem('notes')) {
			notes = JSON.parse(angular.fromJson(localStorage.getItem('notes')));
		}
		var idx = notes.indexOf(note);
		notes.splice(idx, 1);
		if (notes.length > 0) {
			localStorage.setItem('notes', JSON.stringify(angular.toJson(notes)));
		} else {
			localStorage.removeItem('notes');
		}
	};

	$scope.styleDefault = 'data-font="" data-size="" data-lineheight="" data-weight="" data-coloration=""';

	$scope.setPasteNote = function($event) {
		document.execCommand('insertText', false, $event.originalEvent.clipboardData.getData('text/plain'));
		$event.preventDefault();
		$scope.pasteNote = true;
	};

	$scope.saveNote = function(note, $event) {
		var currentAnnotation = angular.element($event.target).parent('td').prev('.annotation_area');

		if (currentAnnotation.hasClass('closed')) {
			currentAnnotation.removeClass('closed');
			currentAnnotation.addClass('opened');
			currentAnnotation.css('height', 'auto');
		}

		if (currentAnnotation.hasClass('locked')) {
			currentAnnotation.removeClass('locked');
			currentAnnotation.addClass('unlocked');
			currentAnnotation.attr('contenteditable', 'true');
			currentAnnotation.css('line-height', 'normal');
			currentAnnotation.css('font-family', 'helveticaCND, arial');
			note.styleNote = '<p>' + note.texte + '</p>';
			angular.element($event.target).removeClass('edit_status');
			angular.element($event.target).addClass('save_status');
		} else {
			currentAnnotation.removeClass('unlocked');
			currentAnnotation.addClass('locked');
			currentAnnotation.attr('contenteditable', 'false');
			note.texte = currentAnnotation.html();
			note.styleNote = '<p ' + $scope.styleAnnotation + '> ' + note.texte.replace(/<br>/g, ' \n ') + ' </p>';
			$scope.editNote(note);
			angular.element($event.target).removeClass('save_status');
			angular.element($event.target).addClass('edit_status');
		}
	};

	$scope.editNote = function(note) {
		var notes = [];
		if (localStorage.getItem('notes')) {
			notes = JSON.parse(angular.fromJson(localStorage.getItem('notes')));
		}
		for (var i = 0; i < notes.length; i++) {
			if (notes[i].idNote === note.idNote) {
				notes[i] = note;
				localStorage.setItem('notes', JSON.stringify(angular.toJson(notes)));
				break;
			}
		}
	};

	$scope.enableNoteAdd = function() {
		$scope.isEnableNoteAdd = true;
	};

	$scope.addNoteOnClick = function(event) {
		if ($scope.isEnableNoteAdd && $rootScope.currentIndexPage && $rootScope.currentIndexPage !== 0) {
			if ($('.open_menu').hasClass('shown')) {
				$('.open_menu').removeClass('shown');
				$('.open_menu').parent('.menu_wrapper').animate({
					'margin-left': '160px'
				}, 100);
				$('.zoneID').css('z-index', '9');

			}
			console.log(event.offsetX + '  ' + event.pageX);
			console.log(event.offsetY + '  ' + event.pageY);
			$scope.addNote(event.pageX - 100, event.pageY - 190);
			$scope.isEnableNoteAdd = false;
		}
	};

	$scope.collapse = function($event) {
		if (angular.element($event.target).parent('td').prev('.annotation_area').hasClass('opened')) {
			angular.element($event.target).parent('td').prev('.annotation_area').removeClass('opened');
			angular.element($event.target).parent('td').prev('.annotation_area').addClass('closed');
			angular.element($event.target).parent('td').prev('.annotation_area').css('height', 36 + 'px');
		} else {
			angular.element($event.target).parent('td').prev('.annotation_area').removeClass('closed');
			angular.element($event.target).parent('td').prev('.annotation_area').addClass('opened');
			angular.element($event.target).parent('td').prev('.annotation_area').css('height', 'auto');
		}
	};

	/* Fin Gestion des notes dans l'apercu */


	$scope.serviceUpgrade = function() {
		$('.loader_cover').show();
		$scope.showloaderProgressScope = true;
		$scope.loaderMessage = 'Récupération de la nouvelle version de l\'application';
		$scope.loaderProgress = 30;
		var docApercuPath = decodeURIComponent(/(([0-9]+)(-)([0-9]+)(-)([0-9]+)(_+)([A-Za-z0-9_%]*)(.html))/i.exec(encodeURIComponent($location.absUrl()))[0]);

		var lienListDoc = localStorage.getItem('dropboxLink').substring(0, localStorage.getItem('dropboxLink').indexOf('.html') + 5);
		console.log('Lien dropbox : ' + lienListDoc);
		var tmp = dropbox.download(docApercuPath, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
		tmp.then(function(oldPage) {
			//manifest
			var manifestStart = oldPage.indexOf('manifest="');
			var manifestEnd = oldPage.indexOf('.appcache"', manifestStart) + 10;
			var manifestString = oldPage.substring(manifestStart, manifestEnd);
			//owner
			var ownerStart = oldPage.indexOf('ownerId');
			var ownerEnd = oldPage.indexOf('\';', ownerStart) + 1;
			var ownerString = oldPage.substring(ownerStart, ownerEnd);
			//document JSON
			var blockStart = oldPage.indexOf('var blocks');
			var blockEnd = oldPage.indexOf('};', blockStart) + 1;
			var blockString = oldPage.substring(blockStart, blockEnd);
			$scope.loaderProgress = 50;
			$http.get(configuration.URL_REQUEST + '/listDocument.appcache').then(function(newAppcache) {
				var newVersion = parseInt(newAppcache.data.charAt(29)) + parseInt(Math.random() * 100);
				newAppcache.data = newAppcache.data.replace(':v' + newAppcache.data.charAt(29), ':v' + newVersion);
				var tmp2 = dropbox.upload(docApercuPath.replace('.html', '.appcache'), newAppcache.data, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
				tmp2.then(function() {
					$scope.loaderProgress = 70;
					$http.get(configuration.URL_REQUEST + '/index.html').then(function(dataIndexPage) {

						dataIndexPage.data = dataIndexPage.data.replace('var Appversion=\'\'', 'var Appversion=\'' + $scope.newAppVersion + '\'');
						dataIndexPage.data = dataIndexPage.data.replace('<head>', '<head><meta name="utf8beacon" content="éçñøåá—"/>');
						dataIndexPage.data = dataIndexPage.data.replace('ownerId = null', ownerString);
						dataIndexPage.data = dataIndexPage.data.replace('manifest=""', manifestString);
						dataIndexPage.data = dataIndexPage.data.replace('var blocks = []', blockString);
						console.log(dataIndexPage.data);
						$scope.loaderMessage = 'Application de la mise à jour de l\'application';
						$scope.loaderProgress = 90;
						var tmp = dropbox.upload(docApercuPath, dataIndexPage.data, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
						tmp.then(function() { // this is only run after $http completes
							console.log('you can reload');
							if ($scope.testEnv === false) {
								window.location.reload();
							}
						});
					});
				});
			});
		});
	};
});