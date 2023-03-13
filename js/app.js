const koltsegvetesVezerlo = (function () {
  let kiadas = function (id, leiras, ertek) {
    this.id = id;
    this.leiras = leiras;
    this.ertek = ertek;
  };

  let bevetel = function (id, leiras, ertek) {
    this.id = id;
    this.leiras = leiras;
    this.ertek = ertek;
  };

  let vegosszegSzamolas = (tipus) => {
    let osszeg = 0;
    adat.tetelek[tipus].forEach((current) => {
      osszeg += current.ertek;
    });
    adat.osszegek[tipus] = osszeg;
  };

  let adat = {
    tetelek: {
      bev: [],
      kia: [],
    },
    osszegek: {
      bev: [],
      kia: [],
    },
    koltsegVetes: 0,
    szazalek: -1,
  };

  return {
    tetelHozzaad: function (tipus, leiras, ertek) {
      let ujTetel, ID;
      ID = 0;
      if (adat.tetelek[tipus].length > 0) {
        ID = adat.tetelek[tipus][adat.tetelek[tipus].length - 1].id + 1;
      } else {
        ID = 0;
      }

      if (tipus === 'bev') {
        ujTetel = new bevetel(ID, leiras, ertek);
      } else if (tipus === 'kia') {
        ujTetel = new kiadas(ID, leiras, ertek);
      }

      adat.tetelek[tipus].push(ujTetel);
      return ujTetel;
    },

    tetelTorol: (tipus, id) => {
      let idTomb, index;
      console.log('ez most ' + tipus);
      idTomb = adat.tetelek[tipus].map((aktualis) => {
        return aktualis.id;
      });
      index = idTomb.indexOf(id);

      if (index !== -1) {
        adat.tetelek[tipus].splice(index, 1);
      }
    },

    koltsegvetesSzamolas: () => {
      vegosszegSzamolas('bev');
      vegosszegSzamolas('kia');
      adat.koltsegVetes = adat.osszegek.bev - adat.osszegek.kia;
      if (adat.osszegek.bev > 0) {
        adat.szazalek = Math.round(
          (adat.osszegek.kia / adat.osszegek.bev) * 100
        );
      } else {
        adat.szazalek = -1;
      }
    },

    getKoltsegvetes: () => {
      return {
        koltsegvetes: adat.koltsegVetes,
        osszBevetel: adat.osszegek.bev,
        osszKiadas: adat.osszegek.kia,
        szazalek: adat.szazalek,
      };
    },

    teszt: () => console.log(adat),
  };
})();

const feluletVezerlo = (function () {
  const DOMHozzaad_tipus = document.querySelector('.hozzaad__tipus');
  const DOMHozzaad_leiras = document.querySelector('.hozzaad__leiras');
  const DOMHozzaad_ertek = document.querySelector('.hozzaad__ertek');
  const DOMBevetelTarolo = document.querySelector('.bevetelek__lista');
  const DOMKiadasTarolo = document.querySelector('.kiadasok__lista');
  const DOMKoltsegvetesCimke = document.querySelector('.koltsegvetes__ertek');
  const DOMOsszbevetelCimke = document.querySelector(
    '.koltsegvetes__bevetelek--ertek'
  );
  const DOMOsszkiadasCimke = document.querySelector(
    '.koltsegvetes__kiadasok--ertek'
  );
  const DOMOszazalekCimke = document.querySelector(
    '.koltsegvetes__kiadasok--szazalek'
  );

  return {
    getInput: function () {
      return {
        tipus: DOMHozzaad_tipus.value,
        leiras: DOMHozzaad_leiras.value,
        ertek: parseInt(DOMHozzaad_ertek.value),
      };
    },

    tetelMegjelenites: (obj, tipus) => {
      let html, elem;
      //bevetel
      if (tipus === 'bev') {
        elem = DOMBevetelTarolo;
        html = `<div class="tetel clearfix" id="bev-${obj.id}">
                <div class="tetel__leiras">${obj.leiras}</div>
                <div class="right clearfix">
                  <div class="tetel__ertek">${obj.ertek}</div>
                  <div class="tetel__torol">
                    <button class="tetel__torol--gomb"><i class="ion-ios-close-outline"></i></button>
                  </div>
                </div>
              </div>`;
      } else if (tipus === 'kia') {
        //kiadas
        elem = DOMKiadasTarolo;
        html = `<div class="tetel clearfix" id="kia-${obj.id}">
      <div class="tetel__leiras">${obj.leiras}</div>
      <div class="right clearfix">
        <div class="tetel__ertek">${obj.ertek}</div>
        <div class="tetel__torol">
          <button class="tetel__torol--gomb"><i class="ion-ios-close-outline"></i></button>
        </div>
      </div>
    </div>`;
      }
      elem.insertAdjacentHTML('beforeend', html);
    },

    tetelTorles: (tetelID) => {
      let elem = document.getElementById(tetelID);
      elem.parentNode.removeChild(elem);
    },

    urlapTorles: () => {
      let mezok, mezokTomb;
      mezok = document.querySelectorAll(
        '.hozzaad__leiras' + ', ' + '.hozzaad__ertek'
      );
      mezokTomb = Array.from(mezok);

      mezok.forEach((current, index, array) => {
        current.value = '';
      });
      mezokTomb[0].focus();
    },

    koltsegvetesMegjelenites: (obj) => {
      DOMKoltsegvetesCimke.textContent = obj.koltsegvetes;
      DOMOsszbevetelCimke.textContent = obj.osszBevetel;
      DOMOsszkiadasCimke.textContent = obj.osszKiadas;
      obj.szazalek > 0
        ? (DOMOszazalekCimke.textContent = obj.szazalek + '%')
        : (DOMOszazalekCimke.textContent = '-');
    },
  };
})();

const vezerlo = (function (koltsegvetesVez, feluletVez) {
  const esemenykezelokBeallit = () => {
    DOMHozzaad_gomb.addEventListener('click', vezTetelHozzadas);
    document.addEventListener('keydown', (event) => {
      if (event.key !== undefined && event.key === 'Enter') {
        vezTetelHozzadas();
      } else if (event.keyCode !== undefined && event.keyCode === 13) {
        vezTetelHozzadas();
      }
    });
    DOMkontener.addEventListener('click', vezTetelTorles);
  };
  const DOMHozzaad_gomb = document.querySelector('.hozzaad__gomb');
  const DOMkontener = document.querySelector('.kontener');

  const osszegFrissitese = () => {
    koltsegvetesVezerlo.koltsegvetesSzamolas();
    let koltsegVetes = koltsegvetesVezerlo.getKoltsegvetes();
    console.log(koltsegVetes);
    feluletVezerlo.koltsegvetesMegjelenites(koltsegVetes);
  };

  const vezTetelHozzadas = () => {
    let input, ujTetel;
    input = feluletVezerlo.getInput();

    console.log(input);

    if (input.leiras !== '' && !isNaN(input.ertek) && input.ertek > 0) {
      ujTetel = koltsegvetesVezerlo.tetelHozzaad(
        input.tipus,
        input.leiras,
        input.ertek
      );

      feluletVezerlo.tetelMegjelenites(ujTetel, input.tipus);

      feluletVezerlo.urlapTorles();

      osszegFrissitese();
    }
  };

  const vezTetelTorles = (event) => {
    let tetelID, splitID, tipus;
    tetelID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    console.log('EY MASIK ' + tetelID);
    if (tetelID) {
      splitID = tetelID.split('-');
      tipus = splitID[0];
      ID = parseInt(splitID[1]);
    }

    koltsegvetesVezerlo.tetelTorol(tipus, ID);

    feluletVezerlo.tetelTorles(tetelID);

    osszegFrissitese();
  };

  return {
    init: () => {
      console.log('fut');
      feluletVezerlo.koltsegvetesMegjelenites({
        koltsegvetes: 0,
        osszBevetel: 0,
        osszKiadas: 0,
        szazalek: '-',
      });
      esemenykezelokBeallit();
    },
  };
})(koltsegvetesVezerlo, feluletVezerlo);

vezerlo.init();
