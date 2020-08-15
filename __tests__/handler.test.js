const {getDataAPI} = require('../handler');
const fetch = require('node-fetch');

jest.mock('node-fetch');

test('should fetch Data', () => {
    const espect = [{
        nombre: "Tatooine",
        clima: "arid",
        diametro: "10465"
    },
    {
        nombre: "Tatooine",
        clima: "arid",
        diametro: "10465"
    }];
    const resp = Promise.resolve({json: ()=>({
        name: "Tatooine",
        rotation_period: "23",
        orbital_period: "304",
        diameter: "10465",
        climate: "arid",
        gravity: "1 standard",
        terrain: "desert",
        surface_water: "1",
        population: "200000"
    })});
    const handl = jsonResult=>{
        let {
            name:nombre,
            climate: clima,
            diameter: diametro
        } = jsonResult
        return {
            nombre,
            clima,
            diametro
        }
    }
  fetch.mockResolvedValue(resp);

  return getDataAPI(["url1","url2"], handl).then(data => expect(data).toEqual(espect));
});

test('should fetch Data', () => {
    const espect = [{
        nombre: "Tatooine",
        clima: "arid",
        diametro: "10465"
    }];
    const resp = Promise.resolve({json: ()=>({
        name: "Tatooine",
        rotation_period: "23",
        orbital_period: "304",
        diameter: "10465",
        climate: "arid",
        gravity: "1 standard",
        terrain: "desert",
        surface_water: "1",
        population: "200000"
    })});
    const handl = jsonResult=>{
        let {
            name:nombre,
            climate: clima,
            diameter: diametro
        } = jsonResult
        return {
            nombre,
            clima,
            diametro
        }
    }
  fetch.mockResolvedValue(resp);

  return getDataAPI(["url1"], handl).then(data => expect(data).toEqual(espect));
});