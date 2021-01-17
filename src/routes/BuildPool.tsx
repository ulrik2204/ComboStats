import ListElement from "../components/ListElement/ListElement"

const BuildPool = () => {
    return (
        <div className="content" style={{
            fontSize: "20px"
        }}>
            <h1>Pool of elements</h1>
            <p>The group of elements that are drawn from</p>
            <ol style={{
                height: "450px",
                width: "400px",
                backgroundColor: "#eeeeee",
                borderRadius: "5px",
                overflowX: "hidden",
                overflowY: "auto",
                textAlign: "justify",
                padding: "10px 25px 10px 10px"
            }

            }>
                <ListElement titles={["Element name"]} propertyNames={["Characteristics"]} properties={[["characteristic 1, characteristic 2, blah, blih, bluh, sur, lir, sgfadsaavfe, gafdfvewff, afdsaf..."]]} />
                <ListElement titles={["Element name"]} propertyNames={["Characteristics"]} properties={[["characteristic 1, char 2, ..."]]} />
                <ListElement titles={["Element name"]} propertyNames={["Characteristics"]} properties={[["characteristic 1, char 2, ..."]]} />
                <ListElement titles={["Element name"]} propertyNames={["Characteristics"]} properties={[["characteristic 1, char 2, ..."]]} />
                <ListElement titles={["Element name"]} propertyNames={["Characteristics"]} properties={[["characteristic 1, char 2, ..."]]} />
                <ListElement titles={["Element name"]} propertyNames={["Characteristics"]} properties={[["characteristic 1, char 2, ..."]]} />
                <ListElement titles={["Element name"]} propertyNames={["Characteristics"]} properties={[["characteristic 1, char 2, ..."]]} />
                <ListElement titles={["Element name"]} propertyNames={["Characteristics"]} properties={[["characteristic 1, char 2, ..."]]} />
                <ListElement titles={["Element name"]} propertyNames={["Characteristics"]} properties={[["characteristic 1, char 2, ..."]]} />
                <ListElement titles={["Element name"]} propertyNames={["Characteristics"]} properties={[["characteristic 1, char 2, ..."]]} />
                <ListElement titles={["Element name"]} propertyNames={["Characteristics"]} properties={[["characteristic 1, char 2, ..."]]} />




            </ol>
        </div >
    );

}
export default BuildPool;