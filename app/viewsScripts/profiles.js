﻿var profilesHTML = '<div style=\'display: none\' id=\'profilePage\' data-ng-init=\'initProfil()\' document-methodes="">'+
  '<!-- Header -->'+
  '<!-- <div ng:include="\'/views/common/header.html\'"></div> -->'+
  '<!-- End Header -->'+
  '<div class="msg_succes alert-dismissable" id="addPanel" style="display:none;">'+
    '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times; </button>'+
    '<strong>{{successAdd | translate}}</strong>'+
  '</div>'+
  '<div class="msg_succes alert-dismissable" id="defaultProfile" style="display:none;">'+
    '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
    '<strong>{{successDefault | translate}}</strong>'+
  '</div>'+
  '<div class="msg_succes alert-dismissable" id="defaultProfileCancel" style="display:none;">'+
    '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
    '<strong>{{successDefault | translate}}</strong>'+
  '</div>'+
  '<div class="msg_succes alert-dismissable" id="editPanel" style="display:none;">'+
    '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
    '<strong>{{successMod | translate}}</strong>'+
  '</div>'+
  '<!-- <p class="lead">Always a pleasure scaffolding your apps.</p>'+
  '<p><a class="btn btn-lg btn-success" href="#">Splendid!</a></p> -->'+
  '<div class="msg_succes" id="okEmail" ng-show="envoiMailOk">'+
    '<a href="#" class="alert-link" title="Email envoyé avec succès !">Email envoyé avec succès !</a>'+
  '</div>'+
  '<div class="msg_succes" id="msgSuccess" ng-show="msgSuccess">'+
    '<a href="#" class="alert-link" title="{{msgSuccess}}">{{msgSuccess}}</a>'+
  '</div>'+
  '<div class="msg_error" id="msgError" ng-show="msgError">'+
    '{{msgError}}'+
  '</div>'+
  '<div class="head_section">'+
    '<!-- <div class="col-md-4 text-center"> <span translate>Mes profils  :</span>  <span class="label label-primary">{{listeProfils.length}}</span></div> -->'+
    '<input type="text" class="serach_field pull-left" ng-model="query" id="" name="" ng-change="specificFilter()" placeholder="Recherche un profil ..." />'+
    '<button type="button" class="add_profile grey_btn pull-right" data-toggle="modal" data-target="#addProfileModal" ng-click="preAddProfil()" translate title="{{\'Ajouter un profil\' | translate}}">Ajouter un profil</button>'+
  '</div>'+
  '<table class="">'+
    '<thead>'+
      '<tr>'+
        '<th class="">nom</th>'+
        '<th class="">descriptif</th>'+
        '<th class="">propriétaire</th>'+
        '<th ng-show="admin">par défaut</th>'+
        '<th class="action_zone">action</th>'+
      '</tr>'+
    '</thead>'+
    '<tbody>'+
      '<tr ng-repeat="listeProfil in tests" ng-show="listeProfil.showed">'+
        '<!--  <td><img width="50" height="30" ng-src="data:image/jpg;base64, {{listeProfil.photo}}" ></td> -->'+
        '<td class="profile_name" ng-show="isProfil(listeProfil)">'+
          '<span ng-show="isFavourite(listeProfil)">'+
          '<i class="fa fa-star"></i>'+
          '</span>'+
          '<span ng-show="isDelegated(listeProfil)">'+
          '<i class="fa fa-user"></i>'+
          '</span>{{ listeProfil.nom }}'+
        '</td>'+
        '<td class="profil_desc" ng-show="isProfil(listeProfil)">{{ listeProfil.descriptif }}</td>'+
        '<td class="centering" ng-show="isProfil(listeProfil)">{{displayOwner(listeProfil)}}</td>'+
        '<td ng-show="admin && isProfil(listeProfil)" class="text-center" >'+
          '<div ng-if="isDefault(listeProfil)">'+
            '<i class="fa fa-check"></i>'+
          '</div>'+
          '<div ng-if="!isDefault(listeProfil)">'+
            '<i class="fa fa-times"></i>'+
          '</div>'+
        '</td>'+
        '<td class="action_area centering" ng-show="isProfil(listeProfil)">'+
          '<button type="button" class="action_btn" action-profil="" data-show="{{listeProfil._id}}" data-shown="false">&nbsp;</button>'+
          '<ul class="action_list" data-show="{{listeProfil._id}}">'+
            '<li class="show_item">'+
              '<a href="" title="{{\'Apecru\' | translate}}" data-toggle="modal" ng-click="toViewProfil(listeProfil)">Aperçu</a>'+
            '</li>'+
            '<li class="setting_item" ng-hide=\'{{listeProfil.state == "favoris" || isOwnerDelagate(listeProfil) || listeProfil.state == "default"}}\'>'+
              '<a href="" title="{{\'Modifier\' | translate}}" data-toggle="modal" data-target="#editModal"  ng-click="preModifierProfil(listeProfil)">Modifier</a>'+
            '</li>'+
            '<li ng-show="admin" class="default_profil">'+
              '<a href="" title="defaultProfile" data-target="#" >'+
                '<div ng-if="isDefault(listeProfil)" ng-click="retirerParDefaut(listeProfil)">Retirer profil par défaut</div>'+
                '<div ng-if="!isDefault(listeProfil)" ng-click="mettreParDefaut(listeProfil)">Profil par défaut</div>'+
              '</a>'+
            '</li>'+
            '<li class="duplicating_item" ng-show=\'{{listeProfil.state == "favoris" || listeProfil.state == "delegated" || listeProfil.state == "default"}}\'>'+
              '<a href title="Dupliquer" data-toggle="modal" data-target="#dupliqueFavoritModal" ng-click="preDupliquerProfilFavorit(listeProfil)">Dupliquer</a>'+
            '</li>'+
            '<li class="delegate" ng-show=\'isDelegatedOption(listeProfil)\'>'+
              '<a href title="{{\'Delegate\' | translate}}" data-toggle="modal" data-target="#delegateModal" ng-click="preDeleguerProfil(listeProfil)">Déléguer</a>'+
            '</li>'+
            '<li class="withdraw_delegate" ng-show=\'isAnnuleDelagate(listeProfil)\'>'+
              '<a href title="{{\'CancelDeleguation\' | translate}}" data-toggle="modal" data-target="#annulerDelegateModal" ng-click="preAnnulerDeleguerProfil(listeProfil)">Annuler la déléguation</a>'+
            '</li>'+
            '<li class="withdraw_delegate" ng-show=\'isOwnerDelagate(listeProfil)\'>'+
              '<a href title="{{\'RemoveDeleguation\' | translate}}" data-toggle="modal" data-target="#retirerDelegateModal" ng-click="preRetirerDeleguerProfil(listeProfil)">Retirer la déléguation</a>'+
            '</li>'+
            '<li class="share_item">'+
              '<a href data-toggle="modal" data-toggle="modal" data-target="#shareModal" ng-click="profilApartager(listeProfil)" title="{{\'Partager\' | translate}}">Partager</a>'+
            '</li>'+
            '<li class="removing_item" ng-show="isDeletableIHM(listeProfil)" >'+
              '<a href data-toggle="modal" data-target="#deleteModal" data-dismiss="modal" ng-click="preSupprimerProfil(listeProfil)" title="{{\'Supprimer\' | translate}}">Supprimer</a>'+
            '</li>'+
            '<li class="removing_item" ng-show=\'listeProfil.state == "favoris"\'>'+
              '<a href data-toggle="modal" data-target="#deleteFavouriteModal" data-dismiss="modal" ng-click="preRemoveFavourite(listeProfil)" title="{{\'Supprimer le profil\' | translate}}" >Supprimer le profil des favoris</a>'+
            '</li>'+
            '<!--             <li class="share_item"><a href="" title="Partager" >Partager</a></li>'+
          '-->          </ul>'+
        '</td>'+
        '<td ng-show="!isProfil(listeProfil)" colspan="4">'+
          '<p style="margin-left: {{l.niveau}}px;" ng-repeat="l in listeProfil.tagsText" regle-style="l.texte"></p>'+
        '</td>'+
      '</tr>'+
    '</tbody>'+
  '</table>'+
  '<div class="modal fade" id="addProfileModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false" >'+
    '<div class="modal-dialog adjustPadding" id="modalContent">'+
      '<div class="modal-content">'+
        '<div class="modal-header">'+
          '<button type="button" class="close" ng-click="afficherProfilsClear()" data-dismiss="modal" aria-hidden="true">&times;</button>'+
          '<h4 class="modal-title" id="myModalLabel" translate>Ajouter un profil</h4>'+
        '</div>'+
        '<div ng-show="affichage" class="msg_error">'+
          '<ul ng-repeat="error in addFieldError">'+
            '<li>Le champ <strong>{{error}}</strong> est invalide</li>'+
          '</ul>'+
        '</div>'+
        '<ul ng-show="erreurAfficher" class="msg_error">'+
          '<li>Vous devez saisir au moins une <strong>Règle</strong> de style </li>'+
        '</ul>'+
        '<div class="modal-body adjust-modal-body">'+
          '<div class="row-fluid span6">'+
            '<div class="tab-content">'+
              '<div class="tab-pane active" id="profile" ng-form="AjoutformValidation" >'+
                '<form class="form-horizontal" role="form" id="addProfile" name="addProfile">'+
                  '<!--  <div class="form-group">'+
                    '<label class="sr-only" for="photo" class="col-sm-2 control-label">Photo</label>'+
                    '<div class="col-sm-9">'+
                      '<input type="file" class="form-control" id="photo" placeholder="Entrez la photo" ng-model="profil.photo">'+
                    '</div>'+
                  '</div> -->'+
                  '<fieldset>'+
                    '<h5>Information liées au profil <span>(obligatoire)</span></h5>'+
                    '<p class="controls_zone pull-left">'+
                    '<label for="nom" class=""><span translate>Nom</span> <span class="required"> *</span></label>'+
                    '<input type="text" class="" id="nom" placeholder="Entrez le nom" ng-model="profil.nom" required>'+
                    '</p>'+
                    '<p class="controls_zone pull-right">'+
                    '<label  for="descriptif" class=""><span translate>Descriptif</span> <span class="required"> *</span></label>'+
                    '<input type="text" class="" id="descriptif" placeholder="Entrez le descriptif" ng-model="profil.descriptif" required />'+
                    '</p>'+
                  '</fieldset>'+
                  '<fieldset class="noblackBorder">'+
                    '<h5>Paramètres principaux du profil</h5>'+
                    '<div class="regles_area">'+
                      '<div class="regles-head_area">'+
                        '<p class="controls_zone">'+
                        '<label for="tag" class=""><span translate>Regles</span> <span class="required"> *</span></label>'+
                        '<select sselect class="" ng-model="tagList" required>'+
                          '<option ng-repeat="tag in listTags" value="{{tag}}" ng-disabled="affectDisabled(tag.disabled)">{{tag.libelle}}</option>'+
                        '</select>'+
                        '<!-- <select sselect id="t1" ng-model="curval">'+
                          '<option ng-repeat="i in listTag.libelle" value="{{i}}" ng-disabled="disabled[i]">{{i}}</option>'+
                        '</select> -->'+
                        '</p>'+
                      '</div>'+
                      '<div class="regles-body_area">'+
                        '<div class="pull-left">'+
                          '<p class="controls_zone">'+
                          '<label  for="police" class=""><span translate>Police </span><span class="required"> *</span></label>'+
                          '<select sselect class="" ng-model="policeList" ng-change="reglesStyleChange(\'police\', policeList)" required>'+
                            '<option ng-repeat="police in policeLists" value="{{police}}">{{police}}</option>'+
                          '</select>'+
                          '</p>'+
                          '<p class="controls_zone">'+
                          '<label  for="taille" class=""><span translate>Taille </span><span class="required"> *</span></label>'+
                          '<select sselect class="" ng-model="tailleList" ng-change="reglesStyleChange(\'taille\', tailleList)" required>'+
                            '<option ng-repeat="taille in tailleLists" value="{{taille.number}}">{{taille.number}}</option>'+
                          '</select>'+
                          '</p>'+
                          '<p class="controls_zone">'+
                          '<label  for="tag" class=""><span translate>Interligne </span><span class="required"> *</span></label>'+
                          '<select sselect class="" ng-model="interligneList" ng-change="reglesStyleChange(\'interligne\', interligneList)" required>'+
                            '<option ng-repeat="interligne in interligneLists" value="{{interligne.number}}">{{interligne.number}}</option>'+
                          '</select>'+
                          '</p>'+
                          '<p class="controls_zone">'+
                          '<label for="couleur" class=""><span translate>Coloration </span><span class="required"> *</span></label>'+
                          '<select sselect class="" ng-model="colorList" ng-change="reglesStyleChange(\'coloration\',colorList)" required>'+
                            '<option ng-repeat="color in colorLists" value="{{color}}">{{color}}</option>'+
                          '</select>'+
                          '</p>'+
                          '<p class="controls_zone">'+
                          '<label  for="tag" class=""><span translate>Style </span><span class="required"> *</span></label>'+
                          '<select sselect class="" ng-model="weightList" ng-change="reglesStyleChange(\'style\',weightList)" required>'+
                            '<option ng-repeat="weight in weightLists" value="{{weight}}">{{weight}}</option>'+
                          '</select>'+
                          '</p>'+
                        '</div>'+
                        '<div class="pull-right">'+
                          '<div class="show_zone">'+
                            '<p class="text-center shown-text-add" id="style-affected-add" regle-style="displayText" data-font="{{policeList}}" data-size="{{tailleList}}" data-lineheight="{{interligneList}}" data-weight="{{weightList}}" data-coloration="{{colorList}}">'+
                            '</p>'+
                          '</div>'+
                          '<div class="regles_exists">'+
                            '<ul>'+
                              '<li ng-repeat="var in tagStyles">'+
                                '<span class="label_action">{{var.label}} <span translate>style avec succes</span></span>'+
                                '<a class="delete_tag" href="" title="{{\'DeleteTag\' | translate}}" ng-click="ajoutSupprimerTag(var)">&nbsp;</a>'+
                              '</li>'+
                            '</ul>'+
                          '</div>'+
                        '</div>'+
                      '</div>'+
                      '<p class="validation_regles">'+
                      '<button type="button" id="addProfileValidation" class="btn_simple light_blue" ng-click="beforeValidationAdd()" translate title="{{\'validerLaRegle\' | translate}}" >validerLaRegle</button>'+
                      '</p>'+
                    '</div>'+
                  '</fieldset>'+
                  '<div class="centering" id="ProfileButtons">'+
                    '<button type="button" class="reset_btn" ng-click="afficherProfilsClear()" data-dismiss="modal" translate title="{{\'Annuler\' | translate}}">Annuler</button>'+
                    '<button type="button" class="btn_simple light_blue addProfile" ng-click="ajouterProfil()" translate title="{{\'enregistrerCeProfil\' | translate}}">enregistrerCeProfil</button>'+
                  '</div>'+
                '</form>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
        '<!-- /.modal-content -->'+
      '</div>'+
      '<!-- /.modal-dialog -->'+
      '</div><!-- /.modal -->'+
    '</div>'+
    '<div class="modal fade" id="actionModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false" >'+
      '<div class="modal-dialog">'+
        '<div class="modal-content">'+
          '<div class="modal-header">'+
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
            '<h4 class="modal-title" id="myModalLabel">Action</h4>'+
          '</div>'+
          '<div class="modal-body adjust-modal-body ">'+
            '<a href data-toggle="modal" data-target="#editModal" data-dismiss="modal" ng-click="editHyphen()" title="{{\'Modifier le profil\' | translate}}" translate>'+
              'Modifier le profil'+
            '</a>'+
            '<div class="well col-md-3 col-md-offset-1 adjust-well" translate title="Voir un aperçu">Voir un aperçu</div>'+
            '<div class="well col-md-3 col-md-offset-1 adjust-well" translate title="Dupliquer le profil">Dupliquer le profil</div>'+
            '<a href data-toggle="modal" data-target="#deleteModal" data-dismiss="modal" title="Supprimer le profil">'+
              '<div class="well col-md-3 adjust-well" translate>Supprimer le profil </div>'+
            '</a>'+
            '<div class="well col-md-3 col-md-offset-1 adjust-well" translate title="Modifier les informations">Modifier les informations</div>'+
            '<div class="well col-md-3 col-md-offset-1 adjust-well" translate title="Partager">Partager</div>'+
          '</div>'+
        '</div>'+
        '<!-- /.modal-content -->'+
      '</div>'+
      '<!-- /.modal-dialog -->'+
    '</div>'+
    '<!-- /.modal -->'+
    '<!-- Edit modal declaration !-->'+
    '<div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false"  >'+
      '<div class="modal-dialog adjustPadding" id="edit-Modal" >'+
        '<div class="modal-content" >'+
          '<div class="modal-header">'+
            '<button type="button" class="close" ng-click="afficherProfilsClear()" data-dismiss="modal" aria-hidden="true">&times;</button>'+
            '<h4 class="modal-title" id="myModalLabel" translate>Modifier le profil</h4>'+
          '</div>'+
          '<div ng-show="affichage" class="msg_error">'+
            '<ul ng-repeat="error in addFieldError">'+
              '<li>Le champ <strong>{{error}}</strong> est invalide</li>'+
            '</ul>'+
          '</div>'+
          '<ul ng-show="erreurAfficher" class="msg_error">'+
            '<li>Vous devez saisir au moins une <strong>Règle</strong> de style </li>'+
          '</ul>'+
          '<div class="modal-body adjust-modal-body">'+
            '<div class="row-fluid span6" ng-form="editionFormValidation">'+
              '<form class="form-horizontal" role="form" id="editProfile" name="editProfile" novalidate>'+
                '<fieldset>'+
                  '<h5>Information liées au profil <span>(obligatoire)</span></h5>'+
                  '<p class="controls_zone pull-left">'+
                  '<label for="nom" class=""><span translate>Nom</span> <span class="required"> *</span></label>'+
                  '<input type="text" class="" ng-model="profMod.nom" value="profMod.nom" required>'+
                  '</p>'+
                  '<p class="controls_zone pull-right">'+
                  '<label for="descriptif" class=""><span translate>Descriptif</span> <span class="required"> *</span></label>'+
                  '<input type="text" class="" ng-model="profMod.descriptif" value="profMod.descriptif" placeholder="Entrez le descriptif" required>'+
                  '</p>'+
                '</fieldset>'+
                '<fieldset class="noblackBorder">'+
                  '<h5>Paramètres principaux du profil</h5>'+
                  '<div class="regles_area">'+
                    '<div class="regles-head_area">'+
                      '<p class="controls_zone">'+
                      '<label for="tag" class=""><span translate>Regles</span> <span class="required"> *</span></label>'+
                      '<select sselect id="selectId" class="" ng-model="editTag" required>'+
                        '<option ng-repeat="tag in listTags" value="{{tag}}" ng-disabled="affectDisabled(tag.disabled)">{{tag.libelle}}</option>'+
                      '</select>'+
                      '</p>'+
                      '<div ng-hide="hideVar" class="blocker">&nbsp;</div>'+
                    '</div>'+
                    '<div class="regles-body_area">'+
                      '<div class="pull-left">'+
                        '<p class="controls_zone">'+
                        '<label  for="police" class="" ><span translate>Police </span><span class="required"> *</span></label>'+
                        '<select sselect class="" ng-model="policeList" ng-change="editStyleChange(\'police\', policeList)" required>'+
                          '<option ng-repeat="police in policeLists" value="{{police}}" > {{police}}</option>'+
                        '</select>'+
                        '</p>'+
                        '<p class="controls_zone">'+
                        '<label  for="taille" class="" ><span translate>Taille </span><span class="required"> *</span></label>'+
                        '<select sselect class="" ng-model="tailleList" ng-change="editStyleChange(\'taille\', tailleList)" required>'+
                          '<option ng-repeat="taille in tailleLists" value="{{taille.number}}">{{taille.number}}</option>'+
                        '</select>'+
                        '</p>'+
                        '<p class="controls_zone">'+
                        '<label  for="tag" class=""><span translate>Interligne </span><span class="required"> *</span></label>'+
                        '<select sselect class="" ng-model="interligneList" ng-change="editStyleChange(\'interligne\', interligneList)" required>'+
                          '<option ng-repeat="interligne in interligneLists" value="{{interligne.number}}">{{interligne.number}}</option>'+
                        '</select>'+
                        '</p>'+
                        '<p class="controls_zone">'+
                        '<label for="coloration" class=""><span translate>Coloration </span><span class="required"> *</span> </label>'+
                        '<select sselect class="" ng-model="colorList" ng-change="editStyleChange(\'coloration\',colorList)" required >'+
                          '<option ng-repeat="color in colorLists" value="{{color}}">{{color}}</option>'+
                        '</select>'+
                        '</p>'+
                        '<p class="controls_zone">'+
                        '<label for="tag" class=""><span translate>Style </span><span class="required"> *</span></label>'+
                        '<select sselect class="" ng-model="weightList" ng-change="editStyleChange(\'style\',weightList)" required>'+
                          '<option ng-repeat="weight in weightLists" value="{{weight}}">{{weight}}</option>'+
                        '</select>'+
                        '</p>'+
                      '</div>'+
                      '<div class="pull-right">'+
                        '<div class="show_zone">'+
                          '<p class="text-center shown-text-edit" id="style-affected-edit" data-font="{{policeList}}" data-size="{{tailleList}}" data-lineheight="{{interligneList}}" data-weight="{{weightList}}" data-coloration="{{colorList}}" regle-style="displayText">'+
                          '</p>'+
                        '</div>'+
                        '<div class="regles_exists editing_tag">'+
                          '<ul>'+
                            '<li ng-repeat="var in tagStyles">'+
                              '<span id="{{var._id}}" class="{{label_action}}">{{var.tagLibelle}} <span translate>modifie</span></span>'+
                              '<a class="set_tag" href="" title="Edit le tag" ng-click="editionModifierTag(var)">&nbsp;</a>'+
                              '<a class="delete_tag" href="" title="Supprimer le tag" ng-click="editionSupprimerTag(var)">&nbsp;</a>'+
                            '</li>'+
                          '</ul>'+
                        '</div>'+
                      '</div>'+
                    '</div>'+
                    '<p class="validation_regles">'+
                    '<button type="button" id="editValidationButton" class="btn_simple light_blue" ng-click="beforeValidationModif()" translate title="Valider la règle">validerLaRegle</button>'+
                    '</p>'+
                  '</div>'+
                '</fieldset>'+
                '<div class="centering" id="ProfileButtons">'+
                  '<button type="button" class="reset_btn" ng-click="afficherProfilsClear()" data-dismiss="modal" translate title="Annuler">Annuler</button>'+
                  '<button type="button" class="btn_simple light_blue editionProfil" ng-click="modifierProfil()" ng-disabled="checkStyleTag()" translate title="Enregistrer le profil">Enregistrer le profil</button>'+
                '</div>'+
              '</form>'+
            '</div>'+
          '</div>'+
        '</div>'+
        '<!-- /.modal-content -->'+
        '</div><!-- /.modal-dialog -->'+
        '</div><!-- /.modal -->'+
        '<!-- Delete modal declaration !-->'+
        '<div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">'+
          '<div class="modal-dialog">'+
            '<div class="modal-content">'+
              '<div class="modal-header">'+
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                '<h4 class="modal-title" id="myModalLabel" translate>Supprimer le profil</h4>'+
              '</div>'+
              '<div class="modal-body adjust-modal-body">'+
                '<div class="info_txt">'+
                  '<p class="text_left ajustPadding_bottom">'+
                  'Le profil sélectionné va être définitivement supprimé du système. Confirmez-vous cette suppression?'+
                  '</p>'+
                '</div>'+
                '<p class="centering">'+
                '<button type="button" class="reset_btn ng-scope" data-dismiss="modal" ng-click="afficherProfils()" translate title="Annuler">Annuler</button>'+
                '<button type="button" class="btn_simple light_blue editionProfil ng-scope" ng-click="supprimerProfil()" data-dismiss="modal" translate title="Supprimer">Supprimer</button>'+
                '</p>'+
              '</div>'+
            '</div>'+
            '<!-- /.modal-content -->'+
          '</div>'+
          '<!-- /.modal-dialog -->'+
        '</div>'+
        '<!-- Duplique Favorit Profil Modal declaration !-->'+
        '<div class="modal fade" id="dupliqueFavoritModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false"  >'+
          '<div class="modal-dialog" id="edit-Modal" >'+
            '<div class="modal-content" >'+
              '<div class="modal-header">'+
                '<button type="button" class="close" ng-click="afficherProfilsClear()" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                '<h4 class="modal-title" id="myModalLabel" translate>Dupliquer le profil</h4>'+
              '</div>'+
              '<div ng-show="affichage" class="msg_error">'+
                '<ul ng-repeat="error in addFieldError">'+
                  '<li>Le champ <strong>{{error}}</strong> est invalide</li>'+
                '</ul>'+
              '</div>'+
              '<div class="modal-body adjust-modal-body">'+
                '<div class="row-fluid span6" ng-form="editionFormValidation">'+
                  '<form class="form-horizontal" role="form" id="editProfile" name="editProfile" novalidate>'+
                    '<fieldset>'+
                      '<h5>Information liées au profil <span>(obligatoire)</span></h5>'+
                      '<p class="controls_zone pull-left">'+
                      '<label for="nom" class=""><span translate>Nom</span> <span class="required"> *</span></label>'+
                      '<input type="text" class="" ng-model="profMod.nom" value="profMod.nom" required>'+
                      '</p>'+
                      '<p class="controls_zone pull-right">'+
                      '<label for="descriptif" class=""><span translate>Descriptif</span> <span class="required"> *</span></label>'+
                      '<input type="text" class="" ng-model="profMod.descriptif" value="profMod.descriptif" placeholder="Entrez le descriptif" required>'+
                      '</p>'+
                    '</fieldset>'+
                    '<fieldset>'+
                      '<h5>Paramètres principaux du profil</h5>'+
                      '<div class="regles_area">'+
                        '<div class="regles-head_area">'+
                          '<p class="controls_zone">'+
                          '<label for="tag" class=""><span translate>Regles</span> <span class="required"> *</span></label>'+
                          '<select sselect id="selectId" class="" ng-model="editTag" required>'+
                            '<option ng-repeat="tag in listTags" value="{{tag}}" ng-disabled="affectDisabled(tag.disabled)">{{tag.libelle}}</option>'+
                          '</select>'+
                          '</p>'+
                          '<div ng-hide="hideVar" class="blocker">&nbsp;</div>'+
                        '</div>'+
                        '<div class="regles-body_area">'+
                          '<div class="pull-left">'+
                            '<p class="controls_zone">'+
                            '<label  for="police" class=""><span translate>Police </span><span class="required"> *</span></label>'+
                            '<select sselect class="" ng-model="policeList" ng-change="dupliqueStyleChange(\'police\', policeList)" required>'+
                              '<option ng-repeat="police in policeLists" value="{{police}}" > {{police}}</option>'+
                            '</select>'+
                            '</p>'+
                            '<p class="controls_zone">'+
                            '<label  for="taille" class=""><span translate>Taille </span><span class="required"> *</span></label>'+
                            '<select sselect class="" ng-model="tailleList" ng-change="dupliqueStyleChange(\'taille\', tailleList)" required>'+
                              '<option ng-repeat="taille in tailleLists" value="{{taille.number}}">{{taille.number}}</option>'+
                            '</select>'+
                            '</p>'+
                            '<p class="controls_zone">'+
                            '<label  for="tag" class=""><span translate>Interligne </span><span class="required"> *</span></label>'+
                            '<select sselect class="" ng-model="interligneList" ng-change="dupliqueStyleChange(\'interligne\', interligneList)" required>'+
                              '<option ng-repeat="interligne in interligneLists" value="{{interligne.number}}">{{interligne.number}}</option>'+
                            '</select>'+
                            '</p>'+
                            '<p class="controls_zone">'+
                            '<label for="coloration" class=""><span translate>Coloration </span><span class="required"> *</span> </label>'+
                            '<select sselect class="" ng-model="colorList" ng-change="dupliqueStyleChange(\'coloration\',colorList)" required >'+
                              '<option ng-repeat="color in colorLists" value="{{color}}">{{color}}</option>'+
                            '</select>'+
                            '</p>'+
                            '<p class="controls_zone">'+
                            '<label for="tag" class=""><span translate>Style </span><span class="required"> *</span></label>'+
                            '<select sselect class="" ng-model="weightList" ng-change="dupliqueStyleChange(\'style\',weightList)" required>'+
                              '<option ng-repeat="weight in weightLists" value="{{weight}}">{{weight}}</option>'+
                            '</select>'+
                            '</p>'+
                          '</div>'+
                          '<div class="pull-right">'+
                            '<div class="show_zone">'+
                              '<p class="text-center shown-text-duplique" id="style-affected-edit" data-font="{{policeList}}" data-size="{{tailleList}}" data-lineheight="{{interligneList}}" data-weight="{{weightList}}" data-coloration="{{colorList}}" regle-style="displayText">'+
                              '</p>'+
                            '</div>'+
                            '<div class="regles_exists editing_tag">'+
                              '<ul>'+
                                '<li ng-repeat="var in tagStyles">'+
                                  '<span id="{{var._id}}" class="{{label_action}}">{{var.tagLibelle}} <span translate>modifie</span></span>'+
                                  '<a class="set_tag" href="" title="Edit le tag" ng-click="dupliqueModifierTag(var)">&nbsp;</a>'+
                                  '<a class="delete_tag" href="" title="Supprimer le tag" ng-click="editionSupprimerTag(var)">&nbsp;</a>'+
                                '</li>'+
                              '</ul>'+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                        '<p class="validation_regles">'+
                        '<button type="button" id="dupliqueValidationButton" class="btn_simple light_blue" ng-click="beforeValidationModif()" translate title="{{\'validerLaRegle\' | translate}}">validerLaRegle</button>'+
                        '</p>'+
                      '</div>'+
                    '</fieldset>'+
                    '<div class="centering" id="ProfileButtons">'+
                      '<button type="button" class="reset_btn" ng-click="afficherProfilsClear()" data-dismiss="modal" translate title="{{\'Annuler\' | translate}}">Annuler</button>'+
                      '<button type="button" class="btn_simple light_blue dupliqueProfil" ng-click="dupliquerFavoritProfil()" ng-disabled="checkStyleTag()" translate title="{{\'Enregistrer le profil\' | translate}}" >Enregistrer le profil</button>'+
                    '</div>'+
                  '</form>'+
                '</div>'+
              '</div>'+
            '</div>'+
            '<!-- /.modal-content -->'+
            '</div><!-- /.modal-dialog -->'+
            '</div><!-- /.modal -->'+
            '<!-- Fin Duplique Favorit Profil Modal declaration !-->'+
            '<!-- Debut Delegate Modal declaration !-->'+
            '<div class="modal fade" id="delegateModal" tabindex="-1" role="dialog" aria-labelledby="delegateModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false" >'+
              '<div class="modal-dialog" id="modalContent">'+
                '<div class="modal-content">'+
                  '<div class="modal-header">'+
                    '<button type="button" class="close" ng-click="afficherProfilsParUser()" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                    '<h4 class="modal-title" id="delegateModalLabel">Déléguer un profil</h4>'+
                  '</div>'+
                  '<div ng-show="errorMsg" class="msg_error">'+
                    '{{errorMsg}}'+
                  '</div>'+
                  '<div class="modal-body adjust-modal-body">'+
                    '<div class="row-fluid span6">'+
                      '<div class="tab-content">'+
                        '<div class="tab-pane active" id="document" ng-form="delegateformValidation" >'+
                          '<form class="form-horizontal" role="form" id="delegate" name="delegate">'+
                            '<fieldset class="padding_large" ng-show="!successMsg">'+
                              '<p class="controls_zone">'+
                              '<label for="delegateEmail" class="simple_label"><span>Email :</span> <span class="required"> *</span></label>'+
                              '<input type="text" class="" id="delegateEmail" placeholder="Entrer l\'email du destinataire" ng-model="delegateEmail" required>'+
                              '</p>'+
                            '</fieldset>'+
                            '<div class="centering" id="ProfileButtons">'+
                              '<button type="button" class="reset_btn" data-dismiss="modal" ng-click="afficherProfilsParUser()" title="Annuler">Annuler</button>'+
                              '<button type="button" class="btn_simple light_blue" ng-click="deleguerProfil()" title="Envoyer">Envoyer</button>'+
                            '</div>'+
                          '</form>'+
                        '</div>'+
                      '</div>'+
                    '</div>'+
                  '</div>'+
                  '<!-- /.modal-content -->'+
                '</div>'+
                '<!-- /.modal-dialog -->'+
                '</div><!-- /.modal -->'+
              '</div>'+
              '<!-- Fin Delegate Modal declaration !-->'+
              '<!-- Debut Retirer Delegate Modal declaration !-->'+
              '<div class="modal fade" id="retirerDelegateModal" tabindex="-1" role="dialog" aria-labelledby="delegateModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false" >'+
                '<div class="modal-dialog" id="modalContent">'+
                  '<div class="modal-content">'+
                    '<div class="modal-header">'+
                      '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                      '<h4 class="modal-title" id="retireDelegateModalLabel">Retirer la délégation</h4>'+
                    '</div>'+
                    '<div class="modal-body adjust-modal-body">'+
                      '<div class="row-fluid span6">'+
                        '<div class="tab-content">'+
                          '<div class="tab-pane active" id="document" ng-form="delegateformValidation" >'+
                            '<form class="form-horizontal" role="form" id="retireDelegate" name="retireDelegate">'+
                              '<p>Voullez-vous retirer votre délégation?</p>'+
                              '<div class="centering" id="ProfileButtons">'+
                                '<button type="button" class="reset_btn" data-dismiss="modal" title="Annuler">Annuler</button>'+
                                '<button type="button" class="btn_simple light_blue" data-dismiss="modal" ng-click="retireDeleguerProfil()" title="Oui">Oui</button>'+
                              '</div>'+
                            '</form>'+
                          '</div>'+
                        '</div>'+
                      '</div>'+
                    '</div>'+
                    '<!-- /.modal-content -->'+
                  '</div>'+
                  '<!-- /.modal-dialog -->'+
                  '</div><!-- /.modal -->'+
                '</div>'+
                '<!-- Fin Retirer Delegate Modal declaration !-->'+
                '<!-- Debut Annuler Delegate Modal declaration !-->'+
                '<div class="modal fade" id="annulerDelegateModal" tabindex="-1" role="dialog" aria-labelledby="delegateModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false" >'+
                  '<div class="modal-dialog" id="modalContent">'+
                    '<div class="modal-content">'+
                      '<div class="modal-header">'+
                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                        '<h4 class="modal-title" id="annuleDelegateModalLabel">Annuler la délégation</h4>'+
                      '</div>'+
                      '<div class="modal-body adjust-modal-body">'+
                        '<div class="row-fluid span6">'+
                          '<div class="tab-content">'+
                            '<div class="tab-pane active" id="document" ng-form="annuleformValidation" >'+
                              '<form class="form-horizontal" role="form" id="annuleDelegate" name="retireDelegate">'+
                                '<p>Voulez-vous annuler votre délégation?</p>'+
                                '<div class="centering" id="ProfileButtons">'+
                                  '<button type="button" class="reset_btn" data-dismiss="modal" title="Annuler">Annuler</button>'+
                                  '<button type="button" class="btn_simple light_blue" data-dismiss="modal" ng-click="annuleDeleguerProfil()" title="Oui">Oui</button>'+
                                '</div>'+
                              '</form>'+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                      '</div>'+
                      '<!-- /.modal-content -->'+
                    '</div>'+
                    '<!-- /.modal-dialog -->'+
                    '</div><!-- /.modal -->'+
                  '</div>'+
                  '<!-- Fin Annuler Delegate Modal declaration !-->'+
                  '<div class="modal fade" id="deleteFavouriteModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">'+
                    '<div class="modal-dialog">'+
                      '<div class="modal-content">'+
                        '<div class="modal-header">'+
                          '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                          '<h4 class="modal-title" id="myModalLabel" translate>deleteFavoris</h4>'+
                        '</div>'+
                        '<div class="modal-body adjust-modal-body">'+
                          '<p translate>  messageSuppression</p>'+
                          '<p class="centering">'+
                          '<button type="button" class="reset_btn ng-scope" data-dismiss="modal" ng-click="afficherProfils()" translate title="Annuler">Annuler</button>'+
                          '<button type="button" class="btn_simple light_blue editionProfil ng-scope" ng-click="removeFavourite()" data-dismiss="modal" translate title="Supprimer">Supprimer</button>'+
                          '</p>'+
                        '</div>'+
                      '</div>'+
                      '<!-- /.modal-content -->'+
                    '</div>'+
                    '<!-- /.modal-dialog -->'+
                  '</div>'+
                  '<!-- /.modal -->'+
                  '<div class="modal fade" id="shareModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
                    '<div class="modal-dialog">'+
                      '<div class="modal-content">'+
                        '<div class="modal-header">'+
                          '<button type="button" class="close" ng-click="clearSocialShare()" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                          '<h4 class="modal-title" id="myModalLabel">Partager ce profil</h4>'+
                        '</div>'+
                        '<div class="modal-body">'+
                          '<h2><span>Sélectionner un moyen pour partager ce profil</span></h2>'+
                          '<div class="msg_error" id="erreurEmail" style="display:none;">'+
                            'Email incorrect !'+
                          '</div>'+
                          '<p class="centering share_btn_container">'+
                          '<button class="share_btn mail_share" type="button" ng-click="loadMail()" title="Email">&nbsp;</button>'+
                          '<a class="share_link" href="https://www.facebook.com/sharer/sharer.php?u={{envoiUrl}}&t=CnedAdapt"'+
                            'onclick="javascript:window.open(this.href, \'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600\');return false;" target="_blank" title="Partager sur Facebook">'+
                            '<button type="button" class="share_btn fb_share" ng-click="socialShare()" title="Partager sur Facebook">&nbsp;</button>'+
                          '</a>'+
                          '<a class="share_link" href="https://twitter.com/share?url={{envoiUrl}}&via=CnedAdapt&text=Lien CnedAdapt"'+
                            'onclick="javascript:window.open(this.href, \'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600\');return false;" target="_blank" title="Partager sur Twitter">'+
                            '<button type="button" class="share_btn twitter_share" ng-click="socialShare()" title="Partager sur Twitter">&nbsp;</button>'+
                          '</a>'+
                          '<a class="share_link" href="https://plus.google.com/share?url={{envoiUrl}}"'+
                            'onclick="javascript:window.open(this.href, \'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=350,width=480\');return false;" target="_blank" title="Partager sur Google+">'+
                            '<button type="button" class="share_btn gplus_share" ng-click="socialShare()" title="Partager sur Google+">&nbsp;</button>'+
                          '</a>'+
                          '</p>'+
                          '<div class="control_group" ng-show="displayDestination">'+
                            '<h2>adresse email <br><span>Saisissez l’adresse email du destinetaire</span></h2>'+
                            '<p class="mail_area">'+
                            '<label for="destinataire" class="email" id="label_email_etap-one">Email</label>'+
                            '<input type="email" class="" ng-model="destinataire" id="destinataire" placeholder="" />'+
                            '</p>'+
                          '</div>'+
                          '<div class="centering" id="ProfileButtons">'+
                            '<button type="button" class="reset_btn" ng-click="clearSocialShare()" data-dismiss="modal" title="Annuler">Annuler</button>'+
                            '<button type="button" class="btn_simple light_blue" ng-show="displayDestination" ng-click="socialShare()" title="Partager">Partager</button>'+
                          '</div>'+
                        '</div>'+
                      '</div>'+
                    '</div>'+
                  '</div>'+
                  '<div class="modal fade" id="confirmModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false" >'+
                    '<div class="modal-dialog" id="modalContent">'+
                      '<div class="modal-content">'+
                        '<div class="modal-header">'+
                          '<button type="button" class="close" ng-click="" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                          '<h4 class="modal-title" id="myModalLabel">Confirmation d\'envoi</h4>'+
                        '</div>'+
                        '<div class="modal-body adjust-modal-body">'+
                          '<div class="info_txt">'+
                            '<p class="text_left ajustPadding_bottom">'+
                            'Voulez vous envoyer cet email ?'+
                            '</p>'+
                          '</div>'+
                        '</div>'+
                        '<div class="centering" id="confirmationButtons">'+
                          '<button type="button" ng-click=\'clearSocialShare()\' class="reset_btn" data-dismiss="modal" title="Annuler">Annuler</button>'+
                          '<button type="button" class="btn_simple light_blue" ng-click=\'sendMail()\' title="Envoyer">Envoyer</button>'+
                        '</div>'+
                        '<!-- /.modal-content -->'+
                      '</div>'+
                      '<!-- /.modal-dialog -->'+
                      '</div><!-- /.modal -->'+
                    '</div>'+
                    '<div class="row marketing">'+
                      '<!-- <h4>HTML5 Boilerplate</h4>'+
                      '<p>HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.</p>'+
                      
                      '<h4>Angular</h4>'+
                      '<p>AngularJS is a toolset for building the framework most suited to your application development.</p>'+
                      
                      '<h4>Karma</h4>'+
                      '<p>Spectacular Test Runner for JavaScript.</p> -->'+
                    '</div>'+
                  '</div>'+
                  '<div class="fixed_loader" ng-show="loader">'+
                    '<div class="loadre_container">'+
                      '<p class="loader_txt">{{loaderMsg}}</p>'+
                    '</div>'+
                  '</div>';