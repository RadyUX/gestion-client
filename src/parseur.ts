import express, {Express} from "express"
import csvParser from "csv-parser"
import { getAllClients, getClientbyId, addClient, updateClient, deleteClient } from "./sqlite"
import { checkAdmin } from "./sesseur"
import fs from 'fs'

const parser = express.Router()

parser.use(express.urlencoded({extended: true}))







export default parser