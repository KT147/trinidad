import { useState } from "react"
import { useEffect } from "react"
import { Fragment } from "react"


function Table() {

    const [table, setTable] = useState([]) /// Tabel, mida vajadusel muudetakse (nt sorteerimine)
    const [originalTable, setOriginalTable] = useState([]) ///Algne tabel
    const [sortOrder, setSortOrder] = useState("default")
    const [sortColumn, setSortColumn] = useState(null)
    const [openRowId, setOpenRowId] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    useEffect(() => {
        fetch("https://proovitoo.twn.ee/api/list")
        .then(res => res.json())
        .then(json => {setTable(json.list)
        setOriginalTable(json.list)})
    }, [])

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

    // NB! Kuudel tuleb -1 maha arvestada, aga mitte päevadel. 

    function formatDate(date) {
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        return `${day}.${month}.${year}`
    }

    // NB! .padStart(2, '0') tagastab kõik kuupäevad kahekohalised, vajadusel lisab ette 0.
    // -get on Javascriptis kuupäevadega töötamiseks.

    const sortData = (column) => {
        let sortedData = [...table]
        let newSortOrder = "asc"

        if (sortColumn === column) {
            if (sortOrder === "asc"){
                newSortOrder = "desc"
            } else if ( sortOrder === "desc"){
                newSortOrder = "default"
            }
        } if (newSortOrder === "default") {
                sortedData = [...originalTable]
        }
            // Rometil ei olnud perekonnanime ja seepärast  sortedData.sort((a, b) => a[column].localeCompare(b[column].)) ei toiminud
            //a[column] ? a[column].toLowerCase() : "" <-- kas a column on määratud, kui ei ole, siis tagastatakse tühi string
        if (column === "firstname" || column === "surname") {
            if (newSortOrder === "asc") {
                sortedData.sort((a, b) => 
                    (a[column] ? a[column].toLowerCase() : "").localeCompare(b[column] ? b[column].toLowerCase() : "")
                )
            } else if (newSortOrder === "desc") {
                sortedData.sort((a, b) => 
                    (b[column] ? b[column].toLowerCase() : "").localeCompare(a[column] ? a[column].toLowerCase() : "")
                )
            }

        } else if (column === "sex") {
            if (newSortOrder === "asc") {
                sortedData.sort((a, b) => (a.sex === "f") - (b.sex === "f"))
        } else if (newSortOrder === "desc") {
                sortedData.sort((a, b) => (a.sex === "m") - (b.sex === "m"))
            }
     }
        if (column === "personal_code") {
            if (newSortOrder === "asc") {
                sortedData.sort((a, b) => getBirthDate(a.personal_code) - getBirthDate(b.personal_code))
            } else if (newSortOrder === "desc") {
                sortedData.sort((a, b) => getBirthDate(b.personal_code) - getBirthDate(a.personal_code))
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

    // openRowId kontrollib, kas setOpenRowId(id) --> avatakse konkreetse id-ga osa, kui ei siis on setOpenRowId(null) --> ei näidata midagi
    const toggleRow = (id) => {
        setOpenRowId(openRowId === id ? null : id)
    }

    // "\n" jagab teksti lõikudeks
    const truncateText = (text) => 
        text.split("\n")[0] + (text.split("\n").length > 3 ? "..." : "")

    // Regulaaravaldis eemaldab kõik <p> ja </p> sildid
    // g = globaalne otsingumärgis, muidu toimuks formatBodyText ainult esimese leitud vastuse puhul ja teistes mitte.
    const formatBodyText = (text) => {
        return text.replace(/<\/?p>/g, '')
    }
    // (/(\d{3}) --> haarab esimesed 3 numbrit, (\d+) ---> haarab ülejäänud numbrid
    const formatPhone = (phone) => phone.replace(/(\d{3})(\d+)/, '$1 $2')

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
        <table className="table">
            <thead>
                <tr>
                    <th><button className="sort-button" onClick={() => sortData ("firstname")}>Eesnimi <img className="sort-image" src={sortArrow("firstname")}/></button></th>
                    <th><button className="sort-button" onClick={() => sortData ("surname")}>Perekonnanimi <img className="sort-image" src={sortArrow("surname")}/></button></th>
                    <th><button className="sort-button" onClick={() => sortData ("sex")}>Sugu <img className="sort-image" src={sortArrow("sex")}/></button></th>
                    <th><button className="sort-button" onClick={() => sortData ("personal_code")}>Sünnikuupäev <img className="sort-image" src={sortArrow("personal_code")}/></button></th>
                    <th>Telefon</th>
                </tr>
            </thead>
            <tbody>
            {currentItems.map(one => (
                <Fragment key={one.id}>
                <tr key={one.id} onClick={() => toggleRow(one.id)} className={openRowId === one.id ? "open-row" : ""}>
                    <td className="top-info">{one.firstname}</td>
                    <td className="top-info">{one.surname}</td>
                    <td className="top-info">{one.sex === "f" ? "Naine" : one.sex === "m" ? "Mees" : one.sex}</td>
                    <td className="top-info">{formatDate(getBirthDate(one.personal_code))}</td>
                    <td className="top-info">{formatPhone(one.phone)}</td>
                </tr>
                {openRowId === one.id && (
                    <tr className="details-row">
                    <td colSpan="5" className="details-cell">
                        <img className="details-cell-image" src={one.image.small} alt="" />
                        <div className="opened-text">{truncateText(formatBodyText(one.body))}</div>
                    </td>
                    </tr>
                )}
                </Fragment>
            ))}
            </tbody>
        </table>
        <div className="pagination">
            <button className="table-sort-button" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>{"<"}</button>
            {Array.from({ length: endPage - startPage + 1 }, (_, index) => index + startPage).map((page) => (
            <button key={page} onClick={() => handlePageChange(page)} className={currentPage === page ? "active" : "non-active"}>
            {page}
             </button>
            ))}
            <button className="table-sort-button" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>{">"}</button>
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