/* File: passport.js
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



'use strict';

describe('Controller: passportContinueCtrl', function() {
  var $scope, controller;

  beforeEach(module('cnedApp'));

  beforeEach(inject(function($controller, $rootScope) {
    $scope = $rootScope.$new();
    controller = $controller('passportContinueCtrl', {
      $scope: $scope
    });
  }));

  it('passportContinueCtrl:init ', inject(function() {
    $scope.init();
    expect($scope.inscriptionStep1).toBe(false);
    expect($scope.inscriptionStep2).toBe(true);
    expect($scope.inscriptionStep3).toBe(false);
    expect($scope.showStep2part2).toBe(true);
    expect($scope.step2).toBe('btn btn-primary btn-circle');
    expect($scope.step1).toBe('btn btn-default btn-circle');
  }));
  it('passportContinueCtrl:toStep3 ', inject(function() {
    $scope.toStep3();
    expect($scope.step3).toBe('btn btn-primary btn-circle');
    expect($scope.step2).toBe('btn btn-default btn-circle');
    expect($scope.showlogin).toBe(false);
    expect($scope.inscriptionStep1).toBe(false);
    expect($scope.inscriptionStep2).toBe(false);
    expect($scope.inscriptionStep3).toBe(true);
  }));
   it('passportContinueCtrl:toStep3 ', inject(function() {
    $scope.toStep4();
    expect($scope.step4).toBe('btn btn-primary btn-circle');
    expect($scope.step3).toBe('btn btn-default btn-circle');
    expect($scope.showlogin).toBe(false);
    expect($scope.inscriptionStep1).toBe(false);
    expect($scope.inscriptionStep2).toBe(false);
    expect($scope.inscriptionStep3).toBe(false);
    expect($scope.inscriptionStep4).toBe(true);
  }));
});