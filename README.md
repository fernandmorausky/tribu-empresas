# Tribu-empresas

## Table of Contents

- [Getting Started](#getting-started)
- [Node Modules](#node-modules)
- [Unit Test](#unit-test)
- [Deploy](#deploy)
- [Documentation](#documentation)

## Getting Started


Instalar dependencias usando [`npm`](https://www.npmjs.com/) :

```bash
npm install
```

o [`yarn`](https://classic.yarnpkg.com/en/):

```bash
yarn
```

## Node Modules

Cargar la carpeta node_modules en otra carpeta llamada nodejs, luego comprimirlo a un archivo *.zip*

La estructura quedaría de la siguiente manera:

├── nodejs
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
└── node_modules
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
└── node_module1
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
└── node_module2


Crear una capa en AWS LAMBDA y subir el archivo comprimido:

<p align="center"><img src="https://github.com/fernandmorausky/images/blob/master/lambda_layer.png" width="90%"/></p>

Una vez creada la capa, nos dara un ARN que refiere a la capa creada:

<p align="center"><img src="https://github.com/fernandmorausky/images/blob/master/ARN_LAYER.png" width="80%"/></p>

Dicha ARN debemos utilizarla en nuestro archivo *serverless.yml*, reemplazandola en las capas de cada lambda :
<p align="center"><img src="https://github.com/fernandmorausky/images/blob/master/LAYERS_SERVERLESS.png" width="80%"/></p>

Nota: El uso de la capa para subir todo el node_modules, nos permitira separar la capa de dependencia con el código, de manera que podríamos desplegar código mas liviano sin las dependencias.


## Unit Test
Las pruebas unitarias se correran con el siguiente comando 

Con [`npm`](https://www.npmjs.com/)

```bash
npm run test
```
o con [`yarn`](https://classic.yarnpkg.com/en/)

```bash
yarn test
```


## Deploy

Para realizar el despliegue en AWS usar el siquiente comando serverless:

```bash
sls deploy
```

## Documentation

Aprender acerca de Tribu-empresas

- [Getting Started](https://github.com/fernandmorausky/tribu-empresas/new/master?readme=1#getting-started)

