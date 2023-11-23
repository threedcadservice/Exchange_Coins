import { useReactiveVar } from '@apollo/client'
import React, { useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import TradingViewComponent from '../tradingView/RugCheckChart';
import moment from 'moment';
import { networkVar } from '../../variables/WalletVariable'

const useStyles = makeStyles(theme => ({
    paper: {
        overflowX: 'auto',
        width: '100%',
        overflow: 'hidden',
        border: '1px solid gray',
        mt: '10px',
        display: 'grid'
    }
}));

export function RugCheckerChart() { 
    const network = useReactiveVar(networkVar)
    const [tradingHistory, setTradingHistory] = useState({});
    const [basic, setBasic] = useState('');
    const [quote, setQuote] = useState('');
    const styles = useStyles();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            await axios.post(`${process.env.REACT_APP_BASE_URL}/trending/tradingHistory`, {
                address: network.address,
            }).then(res => {
                    if (res.data) {
                        setBasic(res.data.baseTokenSymbol)
                        setQuote(res.data.quoteTokenSymbol)
                        let array = [];
                        for (let k = 0; k < res.data.tradingHistory.length; k++) {
                            const element = res.data.tradingHistory[k];
                            let date = moment(element.blockTimestamp).format();
                            array.push({ date: date, type: element.type, usd: `$${element.volumeUsd}`, token1: element.amount0, token2: element.amount1, price: `$${element.priceUsd}`, transaction: element.txnHash });
                        }
                        setIsLoading(false);
                        setTradingHistory(array);
                        
                    }
                }).catch(err => {
                    console.log(err, 'error');
                })
        }

        if (network.address) {
            fetchData();
        }

    }, [network])

    const columns = [
        { id: 'type', label: 'Type', minWidth: 100, align: 'center' },
        {
            id: 'token1', label: 'Tokens', minWidth: 100, align: 'center',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'usd', label: 'Price USD', minWidth: 100, align: 'center',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'price', label: 'Price USD/Token', minWidth: 100, align: 'center',
            format: (value) => value.toFixed(2),
        },
        { id: 'date', label: 'Time', minWidth: 200, align: 'center' },
        {
            id: 'transaction', label: 'TX', align: 'left',
            format: (value) => value.toFixed(2),
        }
    ];

    return (
        <Box sx={{ display: 'grid', minHeight: '300px' }}>
            <Box style={{ padding: '10px' }}>
                <Box sx={{ width: 'auto !important', borderRadius: '10px', padding: '10px 0px', margin: '0px', display: 'flex' }}>
                    <Box style={{ width: '100%', display: 'flex !important', flexDirection: 'column' }}>
                        {
                            !isLoading?
                                <Box sx={{ minHeight: '20vh', width: '100% !important', borderRadius: '10px', display: 'flex', background: '#23323c', color: 'white' }}>
                                    <Box sx={{ width: '100% !important', borderRadius: '10px', padding: '10px 10px', display: 'flex', background: '#23323c', color: 'white' }}>
                                        <Box style={{ width: '100%' }}>
                                        <TradingViewComponent />
                                        </Box>
                                    </Box>
                                </Box>
                                : <></>
                        }
                        <Paper className={styles.paper}>
                            <TableContainer>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column) => (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                    style={{ minWidth: column.minWidth, background: '#23323c', color: 'white', fontFamily: 'Pancake' }}
                                                >
                                                    {column.label}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody style={{ background: '#23323c' }}>
                                        {
                                            tradingHistory && tradingHistory.length ?
                                                tradingHistory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    .map((row, i) => {
                                                        if (row.type === 'buy') {
                                                            return (
                                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.type + i} >
                                                                    {columns.map((column) => {
                                                                        const value = row[column.id];
                                                                        if (column.id === 'transaction') {
                                                                            let hashNetwork = 'snowtrace.io';
                                                                            if (network.network === 'eth') {
                                                                                hashNetwork = 'etherscan.io';
                                                                            } else if (network.network === 'bsc') {
                                                                                hashNetwork = 'bscscan.com';
                                                                            } else if (network.network === 'polygon') {
                                                                                hashNetwork = 'polygonscan.com'
                                                                            } else if (network.network === 'fantom') {
                                                                                hashNetwork = 'ftmscan.com'
                                                                            }
                                                                            return (
                                                                                <TableCell key={column.id + i} align={column.align} style={{ borderBottom: 'gray', fontFamily: 'Pancake', color: '#29b0ff' }}>
                                                                                    <a target='blank' style={{ color: '#29b0ff', textDecoration:'none' }} href={`https://${hashNetwork}/tx/${value}`}>{'verify'}</a>
                                                                                </TableCell>
                                                                            );
                                                                        } else {
                                                                            return (
                                                                                <TableCell key={column.id + i} align={column.align} style={{ borderBottom: 'gray', fontFamily: 'Pancake', color: '#29b0ff' }}>
                                                                                    {value}
                                                                                    {column.id === 'token1' ? <Box sx={{ fontSize: '10px' }}>{basic}</Box> : <></>}
                                                                                    {column.id === 'usd' ? <Box sx={{ fontSize: '10px' }}>{row['token2'] + ' ' + quote}</Box> : <></>}
                                                                                </TableCell>
                                                                            );
                                                                        }
                                                                    })}
                                                                </TableRow>
                                                            );
                                                        } else {
                                                            return (
                                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.type + i} >
                                                                    {columns.map((column) => {
                                                                        const value = row[column.id];
                                                                        if (column.id === 'transaction') {
                                                                            let hashNetwork = 'snowtrace.io';
                                                                            if (network.network === 'eth') {
                                                                                hashNetwork = 'etherscan.io';
                                                                            } else if (network.network === 'bsc') {
                                                                                hashNetwork = 'bscscan.com';
                                                                            } else if (network.network === 'polygon') {
                                                                                hashNetwork = 'polygonscan.com'
                                                                            } else if (network.network === 'fantom') {
                                                                                hashNetwork = 'ftmscan.com'
                                                                            }
                                                                            return (
                                                                                <TableCell key={column.id + i} align={column.align} style={{ borderBottom: 'gray', fontFamily: 'Pancake', color: '#ff4a68' }}>
                                                                                    <a target='blank' style={{ color: '#ff4a68', textDecoration: 'none' }} href={`https://${hashNetwork}/tx/${value}`}>{'verify'}</a>
                                                                                </TableCell>
                                                                            );
                                                                        } else {
                                                                            return (
                                                                                <TableCell key={column.id + i} align={column.align} style={{ borderBottom: 'gray', fontFamily: 'Pancake', color: '#ff4a68' }}>
                                                                                    {value}
                                                                                    {column.id === 'token1' ? <Box sx={{ fontSize: '10px' }}>{basic}</Box> : <></>}
                                                                                    {column.id === 'usd' ? <Box sx={{ fontSize: '10px' }}>{row['token2'] + ' ' + quote}</Box> : <></>}
                                                                                </TableCell>
                                                                            );
                                                                        }
                                                                    })}
                                                                </TableRow>
                                                            );
                                                        }
                                                    })
                                                :
                                                <></>
                                        }
                                    </TableBody>
                                </Table>
                        </TableContainer>
                        {
                            tradingHistory && tradingHistory.length ?
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 100]}
                                    component="div"
                                    count={tradingHistory.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    style={{ background: '#23323c' }}
                                />
                                :<></>
                            }
                        </Paper>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}