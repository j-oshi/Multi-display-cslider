let addWhiteSpaceBetweenWordsAndNumbers = str => {
    let re = null, result = null;
    re = /[^0-9](?=[0-9])/g; 
    result = str.replace(re, '$& ');
    return result;
}

let stringContainOneWordOrLetter = str => {
    let matches = null;
    str = str.replace(/[^a-zA-Z ]/g,"");
    matches = (str.match(/\S+[^0-9]/g) || []).length;
    return matches;
}

let totalNumberOfDigitsInString = str => {
    let match = null, matchArr = [], re = null;
    re = /-?\d(?:[,\d]*\.\d+|[,\d]*)/g;
    while ((match = re.exec(str)) !== null) {
        matchArr.push(match[0]);
    }
    return matchArr.length;
}

let validateOperandString = (str, funct1, funct2) => {
    let safe = null, match = null, str_check_replace = null;
    if (funct1(str) > 2 || funct2(str) !== 1) {
        return false;
    }
    str_check_replace = str.replace(/<=/ig, "0").replace(/>=/ig, "1").replace(/==/ig, "2");
    str_check_replace = str_check_replace.replace(/ = /g, '#');
    safe = str_check_replace.replace(/>/ig, "3").replace(/</ig, "4").replace(/\s/g, '');
    match = safe.match(/^[0-9a-zA-Z]+$/);

    if (match && match != undefined) {
        return true;
    } else {
        return false;
    }
}

const comparisonOperatorToFunction = {
    ">": (num1, num2) => +num1 > +num2,
    ">=": (num1, num2) => ((+num1 > +num2) || (+num1 == +num2)),
    "<": (num1, num2) => +num1 < +num2,
    "<=": (num1, num2) => +num1 <= +num2,
    "==": (num1, num2) => +num1 == +num2,
}  

const findFirstOperator = str => {
    const [operatorThanOrEqual] = str.split(" ").filter((ch) => [">=", "<=", "=="].includes(ch));
    const [operatorThan] = str.split("").filter((ch) => [">", "<"].includes(ch));
    return operatorThanOrEqual ? operatorThanOrEqual : operatorThan;
}

const executeOperation = str => {
    const operator = findFirstOperator(str);
    const [num1, num2] = str.split(operator);
    return comparisonOperatorToFunction[operator](num1, num2);
};

let standardizeVariable = (str, variable) => {
    let result = null;
    result = str.replace(/[^0-9/\b<=\b/\b=>\b/ ]+/g, variable).replace(/\s\s+/g, ' ');
    return result;
}

let substituteVariableValue = (str, variable, value) => {
    let result = null;
    result = str.replace(variable, value);
    return result;
}

let comparisonType = str => {
    let stringArr = null;
    stringArr = str.split(" ");
    return { 'length' : stringArr.length, 'content': stringArr};
}

let evaluteComparisonExpression = (str, value) => {
    let validateString = null, 
    standardizedString = null, 
    standardizedStringProcessed = null,
    comparisonExpressionType = null,
    result = null;

    validateString = validateOperandString(str, totalNumberOfDigitsInString, stringContainOneWordOrLetter);
    if (!validateString) {
        return false;
    }
    standardizedString = standardizeVariable(str, 'a');
    standardizedStringProcessed = substituteVariableValue(standardizedString, 'a', value);
    comparisonExpressionType = comparisonType(standardizedStringProcessed);

    if (comparisonExpressionType.length === 5) {
        let leftSideOperand = null, rightSideOperand = null, content = [];
        content = comparisonExpressionType.content;
        leftSideOperand = content[0] + " " + content[1] + " " + content[2];
        rightSideOperand = content[2] + " " + content[3] + " " + content[4];

        if (executeOperation(leftSideOperand) && executeOperation(rightSideOperand)) {
            result = true
        } else {
            result = false
        }
    } else if (comparisonExpressionType.length === 3) {
        if (executeOperation(standardizedStringProcessed)) {
            result = true
        } else {
            result = false
        }
    }
    return result;
}

export { 
    stringContainOneWordOrLetter,
    totalNumberOfDigitsInString,
    validateOperandString,
    findFirstOperator,
    executeOperation,
    standardizeVariable,
    substituteVariableValue,
    comparisonType,
    evaluteComparisonExpression 
};

