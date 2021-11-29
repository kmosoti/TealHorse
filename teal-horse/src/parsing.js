// import XMLToReact from '@condenast/xml-to-react';

export const  parserFunction = (xmlString) => {
    let xmlElements = []
    let parser = new DOMParser();
    const androidDOM = parser.parseFromString(xmlString, "text/xml");
    //console.log(androidDOM.activeElement);
    //Code checks if their is an error in the code you've entered
    if(androidDOM.activeElement.textContent && androidDOM.activeElement.textContent.includes("XML Parsing Error")){
      //console.log(androidDOM.activeElement.textContent);
      return "XML Parsing Error"
    }
    //Grabs the lists of parsed elements 
    const nodeList = androidDOM.firstChild.childNodes;
    const layoutAttributes = []
    //console.log(androidDOM.activeElement.attributes)
    for(let i = 0; i < androidDOM.activeElement.attributes.length; i++){
      // if(supportLayoutAttributes.includes(node.localName))
      //console.log(androidDOM.activeElement.attributes[i])
      if(supportLayoutAttributes.includes(androidDOM.activeElement.attributes[i].localName)){
        layoutAttributes.push(androidDOM.activeElement.attributes[i])
      }
    }
    const layoutDesc = [androidDOM.activeElement.nodeName,layoutAttributes ]
    //console.log(layoutAttributes)
    //console.log(nodeList)
    for(let i = 0; i < nodeList.length; i++ ){
      //Loops through the parsed elements and grabs what is usable and appends it to the array of xmlElements
      if(String(nodeList.item(i)) !== '[object Text]') xmlElements.push(nodeList.item(i));
    }
    return [layoutDesc, xmlElements]
}

  export const translateFunction = (elementArray) => {
    /// Element Array [layout name, layout attributes]
    let juniorArray = []
    let stylesArray = []
    var arraylength = elementArray[1].length
    const androidLayout = elementArray[0][0]
    const androidLayoutAttributes = []

    for( let i = 0; i < elementArray[0][1].length; i++){
      //console.log(elementArray[0][1][i])
      androidLayoutAttributes.push(elementArray[0][1][i])
    }

    if(elementArray[1] === 'XML Parsing Error'){
      window.alert('Invalid Entry')
      return 'Invalid Entry'
    }
    else{
      for(let i = 0; i<arraylength; i++){
        console.log(elementArray[1][i].localName.toLowerCase())
        if(supportedElements.includes(elementArray[1][i].localName.toLowerCase())){
          const androidElement = elementArray[1][i].localName.toLowerCase()
          juniorArray.push(
          `
          <${equivalentComponents[androidElement]} styles={styles.${elementArray[1][i].localName}}>
            Lorem ipsum dolor sit amet
          </${equivalentComponents[androidElement]}>
        `)
        }
        else{
          juniorArray.push(
            `
            {/*<${elementArray[1][i].localName} styles={styles.${elementArray[1][i].localName}}>
              Lorem ipsum dolor sit amet
          </${elementArray[1][i].localName}>*/}
          `)
        }
        stylesArray.push(
        `
        ${elementArray[1][i].localName} : {
          ${getReactAttributes(elementArray[1][i].attributes)}
        }
        `
        )
      }
      let reactElements = buildReactClass(juniorArray.join(""))
      //console.log("AndroidLayout: "+androidLayoutAttributes)
      let stylesOutput = buildReactStyles(androidLayoutAttributes, stylesArray.join(","))  
      return reactElements.concat("\n",stylesOutput)
    }
  }

const buildReactClass = (elements) => {
    return `import {StyleSheet} from "react-native"\nimport React from 'react';
    
const OutPutClassFunction = () =>{
  return(
    <div styles={styles.container}>
      ${elements}
    </div>
  )
}

export default OutPutClassFunction
      `
}

const getReactAttributes = (elementAttributes) => {
  let translatedAttributes = []
  for(let i = 0; i < elementAttributes.length; i++){
   //console.log(elementAttributes[i].localName)
    if(supportedElementAttributes.includes(elementAttributes[i].localName)){
      //console.log(elementAttributes[i].localName)
      //console.log(supportedLayoutParameters[elementAttributes[i].localName])
      translatedAttributes.push(`${supportedLayoutParameters[elementAttributes[i].localName]}:"${elementAttributes[i].nodeValue}"`
        )
    }
  }
  //onsole.log(elementAttributes)
  return translatedAttributes.join(',\n\t  ')
}

const buildReactStyles = (androidLayout, styles) => {

  return `//React Native Styling
const styles = StyleSheet.create({
  \tcontainer : { 
\t  ${getReactAttributes(androidLayout)}
  \t},${styles}
})
`
}

const supportLayoutAttributes = ['layout_width', 'layout_height', 'paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom','padding']
const supportedElementAttributes = [
  'layout_width', 
  'layout_height', 
  'paddingLeft', 
  'paddingTop', 
  'paddingRight', 
  'paddingBottom',
  'padding', 
  'layout_margin', 
  'layout_marginTop', 
  'layout_marginBottom', 
  'layout_marginLeft',
  'layout_marginRight'
]

const supportedLayoutParameters =  {
  'layout_width': 'width',
  'layout_height': 'height',
  'padding': 'margin',
  'paddingLeft': 'marginLeft',
  'paddingRight': 'marginRight',
  'paddingTop': 'marginTop',
  'paddingBottom': 'marginBottom',
  'layout_margin': 'margin',
  'layout_marginLeft': 'marginLeft',
  'layout_marginRight': 'marginRight',
  'layout_marginTop': 'marginTop',
  'layout_marginBottom': 'marginBottom'

}

const supportedElements = ['button', 'edittext']

const equivalentComponents = {
  'button':'button',
  'edittext':'textarea'
}