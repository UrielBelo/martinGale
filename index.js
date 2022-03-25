const separator = '---------------------------------------'
var operationValue,winSequence,lossSequence

document.getElementById('submitButton').addEventListener('mousedown', () => {
    const initialValue = parseFloat(document.getElementById('iOperationValue').value)
    const payOut = parseFloat(document.getElementById('ipayOutValue').value)
    const tests = parseInt(document.getElementById('iTestsValue').value)
    const lossLimit = parseFloat(document.getElementById('iLossLimitValue').value)
    const MG = parseFloat(document.getElementById('iMGTValue').value)
    const bank = parseFloat(document.getElementById('iBankValue').value)
    const gainTax = parseFloat(document.getElementById('iRightValue').value)
    submit(initialValue,payOut,tests,lossLimit,MG,bank,gainTax)
})

function submit(pInitialValue,pPayOut,pTests,pLossLim,pMG,pBank,pGainTax){
    const initialValue = pInitialValue
    const payOut = pPayOut
    const tests = pTests
    const MG = pMG
    var bank = pBank
    const gainTax = pGainTax
    var lossLimit
    if(pLossLim == 0){
        lossLimit = 99999999999
    }
    const operationHistory = []
    const bankHistory = []
    const historyToChart = []
    const winHistory = []
    const lossHistory = [] 
    operationValue = initialValue
    winSequence,lossSequence = 0

    for(let i=0; i < tests; i++){
        console.log(`Operação ${i} de ${tests}`)
        console.log(separator)
        bank = bank - operationValue
        var magicNumber = operation(operationValue,gainTax,payOut)
        if( magicNumber == 0){
            bank = bank + parseInt(magicNumber)
            console.log(`Operação com Loss, a banca atual é de: ${bank}`)
            if(operationValue > lossLimit){
                operationValue = initialValue
            }else{
                operationValue = operationValue*MG
            }
            lossSequence++
            winSequence = 0
            console.log(`${lossSequence} Loss em sequência`) 
        }else{
            bank = bank + magicNumber
            console.log(`Operação com Gain, a banca atual é de: ${bank}`)
            operationValue = initialValue
            winSequence++
            lossSequence = 0
            console.log(`${winSequence} Gain em sequência`) 
        }
        console.log(`O Valor da Próxima Operação será de ${operationValue}`)
        operationHistory.push(operationValue)
        bankHistory.push(bank)
        historyToChart.push(i)
        winHistory.push(winSequence)
        lossHistory.push(lossSequence)
    }

    let ctx = document.getElementById('myLineChart')
    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: historyToChart,
            datasets: [{
                data: bankHistory
            }]
        },
        options: {
            elements: {
                line: {
                    tension: 0
                }
            }
        }
    })

    console.log('Testes Finalizados')
    let bestLossSequence = 0,bestWinSequence = 0,bestValueOperation = 0,bestBankValue = 0
    for(let i=0; i<operationHistory.length; i++){if(operationHistory[i] > bestValueOperation){bestValueOperation = operationHistory[i]}}
    for(let i=0; i<bankHistory.length; i++){if(bankHistory[i] > bestBankValue){bestBankValue = bankHistory[i]}}
    for(let i=0; i<winHistory.length; i++){if(winHistory[i] > bestWinSequence){bestWinSequence = winHistory[i]}}
    for(let i=0; i<lossHistory.length; i++){if(lossHistory[i] > bestLossSequence){bestLossSequence = lossHistory[i]}}
    console.log(separator)
    console.log(`A Maior Operação foi de ${bestValueOperation}`)
    console.log(`A Maior Banca foi de: ${bestBankValue}`)
    console.log(`A Maior sequência de Gain foi de: ${bestWinSequence}`)
    console.log(`A Maior sequência de Loss foi de: ${bestLossSequence}`)
}

function operation(value,gainTax,payOut){
    var randomNumber = parseInt(getRadomArbitrary(1,100))
    if(randomNumber > 100 - gainTax){
        return value + (value * payOut)
    }else{
        return parseInt(0)
    }
}
function getRadomArbitrary(min,max){
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}