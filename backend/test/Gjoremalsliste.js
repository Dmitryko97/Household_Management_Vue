let expect = require('chai').expect;
let axios = require('axios');
let bcrypt = require('bcrypt');
let clearDB = require('./testutil').clearDB;
let fakeLogin = require('./testutil').fakeLogin;


let testuser = {
  epost: 'test@test.com',
  fornavn: 'Test',
  etternavn: 'Testesen',
  tlf: '12345678',
  adresse: 'Testveien 1',
  hashed_passord: 'passord',
};

let testGjoremal = {
  navn: "Vask",
  beskrivelse: "Test",
  bruker_id: 1,
  liste_id: 1
};

let testGjoremal2 = {
  navn: "Vask",
  beskrivelse: "Test",
  bruker_id: 1,
  liste_id: 1
};

let test_kollektiv = {navn: 'testkollektiv', beskrivelse: ''};

let testUndergruppe = {
  navn: 'testgruppe',
  beskrivelse: '',
  kollektiv_id: null
};

let testListe = {
  navn: "TestVask"
};

// Innholdet i denne funksjonen brukes ikke, men er her for å
// demonstrere hvordan man chainer axios requests på en oversiktelig måte
let axios_eksempel = function(){

  return axios.get(url)
    .then(response => {
      // kode
      return axios.get(url);
    }).then(response => {
      // kode
      return axios.post(url, data);
    }).then(response => {
      // kode
      return axios.get(url);
    }).then(response => {
      //koden her kjører kun etter alle axios requests er utført.
      //Selve testingen legges typisk her, men kan komme tidligere.
    });
};


describe.skip('Gjoremalsliste',() => {

  // Legg inn et par testusers i basen. Begge testusers er medlem i test_kollektiv som også ligger i basen.
  // Basen tømmes og dette innholdet legges inn på nytt før hver test kjøres

  beforeEach(() => {
    // OBS: Vi må RETURNERE hele kjeden til testbiblioteket vårt, derfor return før clearDB.
    return clearDB()     // Vi må først nullstille testbasen
      .then((response) => {
        // Legg testuser inn i basen
        return axios.post('http://localhost:9100/rest/bruker/', testuser);
      }).then(response => {
        // Finn ut hvilken bruker_id testuser fikk, og legg til i testuser objektet vårt
        testuser.bruker_id = response.data.insertId;

        // Legg in test_kollektiv i basen. testuser blir admin.
        return axios.post('http://localhost:9100/rest/kollektiv/' + testuser.bruker_id, test_kollektiv);
      }).then(response => {
        test_kollektiv.kollektiv_id = response.data.insertId;

        // Legg in testUndergruppe i basen.
        testUndergruppe.kollektiv_id = test_kollektiv.kollektiv_id;
        return axios.post('http://localhost:9100/rest/undergruppe/' + testuser.bruker_id, testUndergruppe);
      }).then(response => {
        testUndergruppe.undergruppe_id = response.data.insertId;

        // Legg in testListe i basen.
        testListe.undergruppe_id = testUndergruppe.undergruppe_id;
        return axios.post('http://localhost:9100/rest/gjoremalsliste/' + testUndergruppe.undergruppe_id, testListe);
      }).then(response => {
        testListe.id = response.data.insertId;

        // Legg in testGjoremal.
        return axios.post('http://localhost:9100/rest/gjoremal/', testGjoremal);
      }).then(response => {
        testGjoremal.gjoremal_id = response.data.insertId;

        // Legg in testGjoremal2.
        return axios.post('http://localhost:9100/rest/gjoremal/', testGjoremal2);
      }).then(response => {
        testGjoremal2.gjoremal_id = response.data.insertId;
      }).catch(exception => {
        console.log(exception);
      });
  });

  it('Hent gjoremalsliste med bestemt id', () => {
    // Hent ut testuser og sammenlign
    return axios.get('http://localhost:9100/rest/gjoremalsliste/' + testListe.id).then(response => {

      // Vi forventer nå at brukerobjektet fra basen er helt likt testuser-objektet vårt som vi la inn tidligere.
      expect(response.data).to.containSubset(testListe);

    });
  });

  it('Hent gjoremalsliste til en undergruppe', () => {

    return axios.get('http://localhost:9100/rest/gjoremalslisterUndergruppe/' + testUndergruppe.undergruppe_id).then((response) => {
      let gjoremaler = response.data;

      // Sjekk at vi fikk ut like mange gjoremal som vi satte inn.
      expect(gjoremaler.length).to.equal(1);

      // Sjekk at brukerne som kom ut er identiske med de som ble satt inn.
      expect(gjoremaler).to.containSubset([testListe]);
    });
  });

  it('Hent gjoremalsliste til et kollektiv', () => {

    return axios.get('http://localhost:9100/rest/gjoremalslisterKollektiv/' + test_kollektiv.kollektiv_id).then((response) => {
      let gjoremaler = response.data;

      // Sjekk at vi fikk ut like mange gjoremal som vi satte inn.
      expect(gjoremaler.length).to.equal(1);

      // Sjekk at brukerne som kom ut er identiske med de som ble satt inn.
      expect(gjoremaler).to.containSubset([testListe]);
    });
  });

  it('Hent gjoremalsliste til en bruker', () => {

    return axios.get('http://localhost:9100/rest/gjoremalslisterBruker/' + testuser.bruker_id).then((response) => {
      let gjoremaler = response.data;

      // Sjekk at vi fikk ut like mange gjoremal som vi satte inn.
      expect(gjoremaler.length).to.equal(1);

      // Sjekk at brukerne som kom ut er identiske med de som ble satt inn.
      expect(gjoremaler).to.containSubset([testListe]);
    });
  });

  it('Oppdater gjoremalsliste', () => {

    let newListe = {
      id: testListe.id,
      navn: "Updated"
    };

    return axios.put('http://localhost:9100/rest/gjoremalsliste/', newListe)
      .then(response => {
        return axios.get('http://localhost:9100/rest/gjoremalsliste/' + newListe.id).then(response => {
          expect(response.data).to.containSubset(newListe);
        });
      });
  });

  it('Favorittiser gjoremalsliste', () => {

    testListe.favoritt = 1;
    return axios.put('http://localhost:9100/rest/favorittGjoremalsliste/', testListe)
      .then(response => {
        return axios.get('http://localhost:9100/rest/gjoremalsliste/' + testListe.id)
      }).then(response => {
        expect(response.data.favoritt).to.equal(testListe.favoritt);
      });
  });

  it('Slett gjoremalsliste',() => {

    return axios.delete('http://localhost:9100/rest/gjoremalsliste/' + testListe.id)
      .then(response => {
        return axios.get('http://localhost:9100/rest/gjoremalsliste/' + testListe.id)
      }).then(response => {
        expect(response.data).to.equal('');
      });
  });
});