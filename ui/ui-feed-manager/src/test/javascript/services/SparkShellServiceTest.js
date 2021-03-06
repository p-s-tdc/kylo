/*-
 * #%L
 * thinkbig-ui-feed-manager
 * %%
 * Copyright (C) 2017 ThinkBig Analytics
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
"use strict";

describe("SparkShellService", function() {
    // Include dependencies
    beforeEach(module(MODULE_FEED_MGR));

    // Setup tests
    var SparkShellService;

    beforeEach(inject(function($injector) {
        this.$injector = $injector;
        SparkShellService = $injector.get("SparkShellService");
    }));

    // constructor
    it("should construct with a SQL statement", function() {
        var service = new SparkShellService("SELECT * FROM invalid");
        expect(service.getScript()).toBe("import org.apache.spark.sql._\nsqlContext.sql(\"SELECT * FROM invalid\").limit(1000)");
    });

    // canRedo
    it("should indicate redo when possible", function() {
        var service = new SparkShellService("SELECT * FROM invalid");
        expect(service.canRedo()).toBe(false);

        service.redo_.push(service.newState());
        expect(service.canRedo()).toBe(true);
    });

    // canUndo
    it("should indicate undo when possible", function() {
        var service = new SparkShellService("SELECT * FROM invalid");
        expect(service.canUndo()).toBe(false);

        service.states_.push(service.newState());
        expect(service.canUndo()).toBe(true);
    });

    // getColumnDefs
    it("should generate column type definitions", function() {
        // Create service
        var service = new SparkShellService("SELECT * FROM invalid");
        service.states_[0].columns = [
            {field: "pricepaid", hiveColumnLabel: "pricepaid"},
            {field: "commission", hiveColumnLabel: "commission"},
            {field: "qtysold", hiveColumnLabel: "qtysold"}
        ];

        // Test column defs
        var defs = service.getColumnDefs();
        expect(defs).toEqual({
            "!name": "columns",
            "pricepaid": "Column",
            "commission": "Column",
            "qtysold": "Column"
        });
    });

    // getColumnLabel
    it("should get column label for field name", function() {
        // Create service
        var service = new SparkShellService("SELECT * FROM invalid");
        service.states_[0].columns = [
            {field: "col1", hiveColumnLabel: "(pricepaid - commission)"}
        ];

        // Test column labels
        expect(service.getColumnLabel("invalid")).toBe(null);
        expect(service.getColumnLabel("col1")).toBe("(pricepaid - commission)")
    });

    // getFeedScript
    it("should get a feed script", function() {
        // Create service
        var service = new SparkShellService("SELECT * FROM invalid");
        service.states_[0].columns = [
            {field: "pricepaid", hiveColumnLabel: "pricepaid"},
            {field: "commission", hiveColumnLabel: "commission"},
            {field: "qtysold", hiveColumnLabel: "qtysold"}
        ];
        service.setFunctionDefs({
            "!define": {"Column": {"as": {"!spark": ".as(%s)", "!sparkType": "column"}}},
            "divide": {"!spark": "%c.divide(%c)", "!sparkType": "column"},
            "multiply": {"!spark": "%c.multiply(%c)", "!sparkType": "column"}
        });

        // Test script
        var formula = "(divide(divide(commission, pricepaid), qtysold) * 100).as(\"overhead\")";
        service.push(tern.parse(formula), {});
        expect(service.getFeedScript()).toBe("import org.apache.spark.sql._\n" +
                                         "sqlContext.sql(\"SELECT * FROM invalid\")" +
                                         ".select(new Column(\"*\"), new Column(\"commission\").divide(new Column(\"pricepaid\"))" +
                                         ".divide(new Column(\"qtysold\")).multiply(functions.lit(100)).as(\"overhead\"))");
    });

    // getFields
    describe("get fields", function() {
        it("from applied transformation", function() {
            var service = new SparkShellService("SELECT * FROM invalid");
            service.states_[0].columns = [
                {dataType: "string", hiveColumnLabel: "username"},
                {dataType: "decimal(8,2)", hiveColumnLabel: "(pricepaid - commission) / qtysold"}
            ];
            expect(service.getFields()).toEqual([
                {name: "username", description: "", dataType: "string", primaryKey: false, nullable: false, sampleValues: [], derivedDataType: "string"},
                {name: "(pricepaid - commission) / qtysold", description: "", dataType: "decimal", primaryKey: false, nullable: false, sampleValues: [], precisionScale: "8,2",
                    derivedDataType: "decimal"}
            ]);
        });
        it("from null columns", function() {
            var service = new SparkShellService("SELECT * FROM invalid");
            expect(service.getFields()).toBe(null);
        });
    });

    // getScript
    describe("get script", function() {
        it("from a column expression", function() {
            // Create service
            var service = new SparkShellService("SELECT * FROM invalid");
            service.states_[0].columns = [
                {field: "pricepaid", hiveColumnLabel: "pricepaid"},
                {field: "commission", hiveColumnLabel: "commission"},
                {field: "qtysold", hiveColumnLabel: "qtysold"}
            ];
            service.setFunctionDefs({
                "!define": {"Column": {"as": {"!spark": ".as(%s)", "!sparkType": "column"}}},
                "divide": {"!spark": "%c.divide(%c)", "!sparkType": "column"},
                "multiply": {"!spark": "%c.multiply(%c)", "!sparkType": "column"}
            });

            // Test script
            var formula = "(divide(divide(commission, pricepaid), qtysold) * 100).as(\"overhead\")";
            service.push(tern.parse(formula), {});
            expect(service.getScript()).toBe("import org.apache.spark.sql._\n" +
                    "sqlContext.sql(\"SELECT * FROM invalid\").limit(1000)" +
                    ".select(new Column(\"*\"), new Column(\"commission\").divide(new Column(\"pricepaid\"))" +
                    ".divide(new Column(\"qtysold\")).multiply(functions.lit(100)).as(\"overhead\"))");
        });
        it("from a filter expression", function() {
            // Create service
            var service = new SparkShellService("SELECT * FROM invalid");
            service.states_[0].columns = [
                {field: "pricepaid", hiveColumnLabel: "pricepaid"},
                {field: "commission", hiveColumnLabel: "commission"},
                {field: "qtysold", hiveColumnLabel: "qtysold"}
            ];
            service.setFunctionDefs({
                "and": {"!spark": "%c.and(%c)", "!sparkType": "column"},
                "equal": {"!spark": "%c.equalTo(%c)", "!sparkType": "column"},
                "filter": {"!spark": ".filter(%c)", "!sparkType": "dataframe"},
                "greaterThan": {"!spark": "%c.gt(%c)", "!sparkType": "column"},
                "subtract": {"!spark": "%c.minus(%c)", "!sparkType": "column"}
            });

            // Test script
            var formula = "filter(qtysold == 2 && pricepaid - commission > 200)";
            service.push(tern.parse(formula), {});
            expect(service.getScript()).toBe("import org.apache.spark.sql._\n" +
                    "sqlContext.sql(\"SELECT * FROM invalid\").limit(1000)" +
                    ".filter(new Column(\"qtysold\").equalTo(functions.lit(2)).and(new Column(\"pricepaid\")" +
                    ".minus(new Column(\"commission\")).gt(functions.lit(200))))");
        });
        it("from an optional expression", function() {
            // Create service
            var service = new SparkShellService("SELECT * FROM invalid");
            service.setFunctionDefs({
                "rand": {"!spark": "functions.rand(%?d)", "!sparkType": "column"}
            });

            // Test script
            var formula = "rand()";
            service.push(tern.parse(formula), {});
            expect(service.getScript()).toBe("import org.apache.spark.sql._\n" +
                    "sqlContext.sql(\"SELECT * FROM invalid\").limit(1000)" +
                    ".select(new Column(\"*\"), functions.rand())");
        });
        it("from a vararg expression", function() {
            // Create service
            var service = new SparkShellService("SELECT * FROM invalid");
            service.states_[0].columns = [
                {field: "username", hiveColumnLabel: "username"},
                {field: "eventname", hiveColumnLabel: "eventname"},
                {field: "qtysold", hiveColumnLabel: "qtysold"},
                {field: "pricepaid", hiveColumnLabel: "pricepaid"}
            ];
            service.setFunctionDefs({
                "!define": {
                    "GroupedData": {
                        "sum": {"!spark": ".sum(%s%,*s)", "!sparkType": "dataframe"}
                    }
                },
                "groupBy": {"!spark": ".groupBy(%*c)", "!sparkType": "groupeddata"}
            });

            // Test script
            var formula = "groupBy(username, eventname).sum(\"qtysold\", \"pricepaid\")";
            service.push(tern.parse(formula), {});
            expect(service.getScript()).toBe("import org.apache.spark.sql._\n" +
                    "sqlContext.sql(\"SELECT * FROM invalid\").limit(1000)" +
                    ".groupBy(new Column(\"username\"), new Column(\"eventname\")).sum(\"qtysold\", \"pricepaid\")");
        });
    });

    // limit
    it("should get and set limit", function() {
        var service = new SparkShellService("SELECT * FROM invalid");
        expect(service.limit()).toBe(1000);

        service.limit(5000);
        expect(service.limit()).toBe(5000);
        expect(service.getScript()).toBe("import org.apache.spark.sql._\nsqlContext.sql(\"SELECT * FROM invalid\").limit(5000)");
    });

    // redo
    it("should redo the last undone transformation", function() {
        // Initialize service
        var service = new SparkShellService("SELECT * FROM invalid");

        var state = service.newState();
        state.context = {formula: "42", icon: "code", name: "answer"};
        state.script = ".withColumn(\"col1\", functions.lit(42))";
        service.redo_.push(state);

        // Test redo
        expect(service.getScript()).toBe("import org.apache.spark.sql._\nsqlContext.sql(\"SELECT * FROM invalid\").limit(1000)");

        expect(service.redo()).toEqual({formula: "42", icon: "code", name: "answer"});
        expect(service.getScript()).toBe("import org.apache.spark.sql._\nsqlContext.sql(\"SELECT * FROM invalid\").limit(1000)" +
                                         ".withColumn(\"col1\", functions.lit(42))");
    });

    // sample
    it("should get and set sample", function() {
        var service = new SparkShellService("SELECT * FROM invalid");
        expect(service.sample()).toBe(1.0);

        service.sample(0.01);
        expect(service.sample()).toBe(0.01);
        expect(service.getScript()).toBe("import org.apache.spark.sql._\nsqlContext.sql(\"SELECT * FROM invalid\")" +
                                         ".sample(false, 0.01).limit(1000)");
    });

    // shouldLimitBeforeSample
    it("should limit before sampling", function() {
        var service = new SparkShellService("SELECT * FROM invalid");
        expect(service.shouldLimitBeforeSample()).toBe(false);

        service.sample(0.01);
        service.shouldLimitBeforeSample(true);
        expect(service.shouldLimitBeforeSample()).toBe(true);
        expect(service.getScript()).toBe("import org.apache.spark.sql._\nsqlContext.sql(\"SELECT * FROM invalid\").limit(1000)" +
                                         ".sample(false, 0.01)");
    });

    // splice
    it("should splice transformation array", function() {
        // Add formulas
        var service = new SparkShellService("SELECT * FROM invalid");
        service.push(tern.parse("42"), {});
        service.push(tern.parse("\"thinkbig\""), {});
        expect(service.getScript()).toBe("import org.apache.spark.sql._\n" +
                                         "sqlContext.sql(\"SELECT * FROM invalid\").limit(1000)" +
                                         ".select(new Column(\"*\"), functions.lit(42))" +
                                         ".select(new Column(\"*\"), functions.lit(\"thinkbig\"))");

        // Delete first formula
        service.splice(1, 1);
        expect(service.getScript()).toBe("import org.apache.spark.sql._\n" +
                                         "sqlContext.sql(\"SELECT * FROM invalid\").limit(1000)" +
                                         ".select(new Column(\"*\"), functions.lit(\"thinkbig\"))");
    });

    // undo
    it("should undo the last transformation", function() {
        // Initialize service
        var service = new SparkShellService("SELECT * FROM invalid");

        var state = service.newState();
        state.context = {formula: "42", icon: "code", name: "answer"};
        state.script = ".withColumn(\"col1\", functions.lit(42))";
        service.states_.push(state);

        // Test redo
        expect(service.getScript()).toBe("import org.apache.spark.sql._\nsqlContext.sql(\"SELECT * FROM invalid\").limit(1000)" +
                                         ".withColumn(\"col1\", functions.lit(42))");

        expect(service.undo()).toEqual({formula: "42", icon: "code", name: "answer"});
        expect(service.getScript()).toBe("import org.apache.spark.sql._\nsqlContext.sql(\"SELECT * FROM invalid\").limit(1000)");
    });
});
