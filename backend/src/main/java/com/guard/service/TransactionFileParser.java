package com.guard.service;

import com.guard.dto.TransactionUploadDTO;
import jakarta.enterprise.context.ApplicationScoped;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.jboss.logging.Logger;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class TransactionFileParser {
    
    private static final Logger LOG = Logger.getLogger(TransactionFileParser.class);
    
    public List<TransactionUploadDTO> parseCSV(InputStream inputStream) {
        List<TransactionUploadDTO> transactions = new ArrayList<>();
        
        try (CSVParser parser = CSVFormat.DEFAULT
                .withFirstRecordAsHeader()
                .withIgnoreHeaderCase()
                .withTrim()
                .parse(new InputStreamReader(inputStream))) {
            
            int rowNum = 1;
            for (CSVRecord record : parser) {
                rowNum++;
                TransactionUploadDTO dto = new TransactionUploadDTO();
                dto.rowNumber = rowNum;
                
                try {
                    dto.transactionId = record.get("transaction_id");
                    dto.entityId = record.get("entity_id");
                    dto.type = record.get("type");
                    dto.amount = new BigDecimal(record.get("amount"));
                    dto.currency = record.get("currency");
                    dto.fromAccount = record.get("from_account");
                    dto.toAccount = record.get("to_account");
                    dto.fromCountry = record.get("from_country");
                    dto.toCountry = record.get("to_country");
                    dto.customerId = record.get("customer_id");
                    dto.description = record.get("description");
                    
                    String timestampStr = record.get("timestamp");
                    if (timestampStr != null && !timestampStr.isBlank()) {
                        dto.timestamp = Instant.parse(timestampStr);
                    }
                    
                    transactions.add(dto);
                } catch (Exception e) {
                    dto.validationError = "Parse error: " + e.getMessage();
                    transactions.add(dto);
                    LOG.warnf("Failed to parse CSV row %d: %s", rowNum, e.getMessage());
                }
            }
        } catch (Exception e) {
            LOG.errorf(e, "Failed to parse CSV file");
            throw new RuntimeException("CSV parsing failed: " + e.getMessage(), e);
        }
        
        return transactions;
    }
    
    public List<TransactionUploadDTO> parseExcel(InputStream inputStream) {
        List<TransactionUploadDTO> transactions = new ArrayList<>();
        
        try (Workbook workbook = new XSSFWorkbook(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);
            int rowNum = 0;
            
            for (Row row : sheet) {
                if (rowNum++ == 0) continue; // Skip header
                
                TransactionUploadDTO dto = new TransactionUploadDTO();
                dto.rowNumber = rowNum;
                
                try {
                    dto.transactionId = getCellValue(row, 0);
                    dto.entityId = getCellValue(row, 1);
                    dto.type = getCellValue(row, 2);
                    
                    String amountStr = getCellValue(row, 3);
                    if (amountStr != null && !amountStr.isBlank()) {
                        dto.amount = new BigDecimal(amountStr);
                    }
                    
                    dto.currency = getCellValue(row, 4);
                    dto.fromAccount = getCellValue(row, 5);
                    dto.toAccount = getCellValue(row, 6);
                    dto.fromCountry = getCellValue(row, 7);
                    dto.toCountry = getCellValue(row, 8);
                    dto.customerId = getCellValue(row, 9);
                    
                    String timestampStr = getCellValue(row, 10);
                    if (timestampStr != null && !timestampStr.isBlank()) {
                        dto.timestamp = Instant.parse(timestampStr);
                    }
                    
                    dto.description = getCellValue(row, 11);
                    
                    transactions.add(dto);
                } catch (Exception e) {
                    dto.validationError = "Parse error: " + e.getMessage();
                    transactions.add(dto);
                    LOG.warnf("Failed to parse Excel row %d: %s", rowNum, e.getMessage());
                }
            }
        } catch (Exception e) {
            LOG.errorf(e, "Failed to parse Excel file");
            throw new RuntimeException("Excel parsing failed: " + e.getMessage(), e);
        }
        
        return transactions;
    }
    
    private String getCellValue(Row row, int cellIndex) {
        Cell cell = row.getCell(cellIndex);
        if (cell == null) return null;
        
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> {
                if (DateUtil.isCellDateFormatted(cell)) {
                    yield cell.getLocalDateTimeCellValue().toString() + "Z";
                } else {
                    double numValue = cell.getNumericCellValue();
                    if (numValue == (long) numValue) {
                        yield String.valueOf((long) numValue);
                    } else {
                        yield String.valueOf(numValue);
                    }
                }
            }
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            case BLANK -> null;
            default -> null;
        };
    }
}

// Made with Bob
