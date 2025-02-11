import { useState } from "react"
import { useEffect } from "react"
import { Fragment } from "react"


function Table() {

    const [table, setTable] = useState([])
    const [originalTable, setOriginalTable] = useState([])
    const [sortOrder, setSortOrder] = useState("default")
    const [sortColumn, setSortColumn] = useState("firstname")
    const [openRowId, setOpenRowId] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    useEffect(() => {
        fetch("https://proovitoo.twn.ee/api/list")
        .then(res => res.json())
        .then(json => {setTable(json.list)
        setOriginalTable(json.list)})
    }, []);

    /// number tuleb stringiks teisendada, sest substring ja slice töötavad ainult stringidega.
    // parseInt on vajalik siis, kui tehakse arvutusi (lisatakse 1900 või 2000 ülejäänud aastaarv)
    function getBirthDate(personalCode) {
        personalCode = personalCode.toString()
        const century = personalCode [0]
        const year = parseInt(personalCode.substring(1,3))
        const month = personalCode.substring(3,5)
        const day = personalCode.substring(5,7)

        let fullYear

        if (century === "3" || century === "4"){
            fullYear = 1900 + year
        } else if (century === "5" || century === "6" ){
            fullYear = 2000 + year
        }
        return new Date(fullYear, month - 1, day)
    }

    function formatDate(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    const sortData = (column) => {
        let sortedData = [...table]
        let newSortOrder = "asc"

        if (sortColumn === column) {
            if (sortOrder === "asc"){
                newSortOrder = "desc"
            } else if ( sortOrder === "desc"){
                newSortOrder = "default"
            } else {
                newSortOrder = "asc"
            }
        } else {
            newSortOrder = "asc"
        }
            if (newSortOrder === "default") {
                sortedData = [...originalTable];
        }
            // Rometil ei olnud perekonnanime ja seepärast  sortedData.sort((a, b) => a[column].localeCompare(b[column].)) ei toiminud
        if (column === "firstname" || column === "surname") {
            if (newSortOrder === "asc") {
                sortedData.sort((a, b) => 
                    (a[column] ? a[column].toLowerCase() : "").localeCompare(b[column] ? b[column].toLowerCase() : "")
                );
            } else if (newSortOrder === "desc") {
                sortedData.sort((a, b) => 
                    (b[column] ? b[column].toLowerCase() : "").localeCompare(a[column] ? a[column].toLowerCase() : "")
                );
            }

        } else if (column === "sex") {
            if (newSortOrder === "asc") {
                sortedData.sort((a) => (a.sex === "f" ? -1 : 1))
        } else if (newSortOrder === "desc") {
                sortedData.sort((a) => (a.sex === "m" ? -1 : 1))
            }
     }
        if (column === "personal_code") {
            if (newSortOrder === "asc") {
                sortedData.sort((a, b) => {
                    const aDate = getBirthDate(a.personal_code);
                    const bDate = getBirthDate(b.personal_code);
                    return aDate - bDate; 
                });
            } else if (newSortOrder === "desc") {
                sortedData.sort((a, b) => {
                    const aDate = getBirthDate(a.personal_code);
                    const bDate = getBirthDate(b.personal_code);
                    return bDate - aDate; 
                });
            }
        }
        setTable(sortedData)
        setSortOrder(newSortOrder)
        setSortColumn(column)
    }

    const sortArrow = (column) => {
        if (sortColumn === column) {
            if (sortOrder === "asc") {
                return "/arrow-down.png"
            } else if (sortOrder === "desc") {
                return "/arrow-up.png"
            }
        }
        return "both-arrows.png"
    }

    const toggleRow = (id) => {
        setOpenRowId(openRowId === id ? null : id)
    }

    const truncateText = (text) => {
        const paragraphs = text.split("\n");
        const visibleText = paragraphs.slice(0, 3).join("\n")
        return visibleText + (paragraphs.length > 3 ? "..." : "")
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }
      
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = table.slice(indexOfFirstItem, indexOfLastItem)

    const totalPages = Math.ceil(table.length / itemsPerPage)
    const visiblePages = Math.min(5, totalPages)
    const halfVisible = Math.floor(visiblePages / 2)
    const startPage = Math.max(1, currentPage - halfVisible)
    const endPage = Math.min(totalPages, startPage + visiblePages - 1)

    // const currentTableData = table.slice(
    //     (currentPage-1) * itemsPerPage,
    //     currentPage * itemsPerPage
    // )

    // const totalPages = Math.ceil(table.length / itemsPerPage)

    // const pageNumbers = [];
    //     for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage +2); i++) {
    //         pageNumbers.push(i)
    //     }
    
    // const changePage = (page) => {
    //     setCurrentPage(page)
    // }
    

  return (
    <div>
        <h1>NIMEKIRI</h1>
        <table>
            <thead>
                <tr>
                    <th><button onClick={() => sortData ("firstname")}>Eesnimi <img src={sortArrow("firstname")}/></button></th>
                    <th><button onClick={() => sortData ("surname")}>Perekonnanimi <img src={sortArrow("surname")}/></button></th>
                    <th><button onClick={() => sortData ("sex")}>Sugu <img src={sortArrow("sex")}/></button></th>
                    <th><button onClick={() => sortData ("personal_code")}>Sünnikuupäev <img src={sortArrow("personal_code")}/></button></th>
                    <th>Telefon</th>
                </tr>
            </thead>
            <tbody>
                {currentItems.map(one=> (
                <Fragment key={one.id}>
                <tr key={one.id} onClick={() => toggleRow(one.id)}>
                    <td>{one.firstname}</td>
                    <td>{one.surname}</td>
                    <td>{one.sex === "f" ? "Naine" : one.sex === "m" ? "Mees" : one.sex}</td>
                    <td>{formatDate(getBirthDate(one.personal_code))}</td>
                    <td>{one.phone}</td>
                </tr>
                 {openRowId === one.id && (
                    <tr key={`${one.id}-details`}>
                        <td colSpan="5">
                            <div>
                                {truncateText(one.body)}
                            </div>
                        </td>
                    </tr>
                    )}
                </Fragment>
                ))}
            </tbody>
        </table>
        <div className="pagination">
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>{"<"}</button>
            {Array.from({ length: endPage - startPage + 1 }, (_, index) => index + startPage).map((page) => (
            <button key={page} onClick={() => handlePageChange(page)} className={currentPage === page ? "active" : ""}>
            {page}
             </button>
            ))}
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>{">"}</button>
            </div>
        {/* <div>
            {pageNumbers.map((page)=> (
                <button key={page} onClick={() => changePage(page)}>
                    {page}
                </button>
            ))}
        </div> */}
    </div>
  )
}

export default Table