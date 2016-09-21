package com.thinkbiganalytics.metadata.rest.jobrepo.nifi;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import org.joda.time.DateTime;

/**
 * Created by sr186054 on 8/23/16.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class NifiFeedProcessorStats {


    protected Long duration = 0L;
    protected DateTime minEventTime;
    protected DateTime maxEventTime;
    protected Long bytesIn = 0L;
    protected Long bytesOut = 0L;
    protected Long totalCount = 1L;
    protected Long jobsStarted = 0L;
    protected Long jobsFinished = 0L;
    protected Long jobsFailed = 0L;
    protected Long jobDuration = 0L;
    protected Long successfulJobDuration = 0L;
    protected Long processorsFailed = 0L;
    protected Long flowFilesStarted = 0L;
    protected Long flowFilesFinished = 0L;
    private String id;
    private String feedName;
    private String processorId;
    private String processorName;
    private String feedProcessGroupId;
    private DateTime collectionTime;
    private String collectionId;
    private Long resultSetCount;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFeedName() {
        return feedName;
    }

    public void setFeedName(String feedName) {
        this.feedName = feedName;
    }

    public String getProcessorId() {
        return processorId;
    }

    public void setProcessorId(String processorId) {
        this.processorId = processorId;
    }

    public String getProcessorName() {
        return processorName;
    }

    public void setProcessorName(String processorName) {
        this.processorName = processorName;
    }

    public String getFeedProcessGroupId() {
        return feedProcessGroupId;
    }

    public void setFeedProcessGroupId(String feedProcessGroupId) {
        this.feedProcessGroupId = feedProcessGroupId;
    }

    public DateTime getCollectionTime() {
        return collectionTime;
    }

    public void setCollectionTime(DateTime collectionTime) {
        this.collectionTime = collectionTime;
    }

    public String getCollectionId() {
        return collectionId;
    }

    public void setCollectionId(String collectionId) {
        this.collectionId = collectionId;
    }

    public Long getDuration() {
        return duration;
    }

    public void setDuration(Long duration) {
        this.duration = duration;
    }

    public DateTime getMinEventTime() {
        return minEventTime;
    }

    public void setMinEventTime(DateTime minEventTime) {
        this.minEventTime = minEventTime;
    }

    public DateTime getMaxEventTime() {
        return maxEventTime;
    }

    public void setMaxEventTime(DateTime maxEventTime) {
        this.maxEventTime = maxEventTime;
    }

    public Long getBytesIn() {
        return bytesIn;
    }

    public void setBytesIn(Long bytesIn) {
        this.bytesIn = bytesIn;
    }

    public Long getBytesOut() {
        return bytesOut;
    }

    public void setBytesOut(Long bytesOut) {
        this.bytesOut = bytesOut;
    }

    public Long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(Long totalCount) {
        this.totalCount = totalCount;
    }

    public Long getJobsStarted() {
        return jobsStarted;
    }

    public void setJobsStarted(Long jobsStarted) {
        this.jobsStarted = jobsStarted;
    }

    public Long getJobsFinished() {
        return jobsFinished;
    }

    public void setJobsFinished(Long jobsFinished) {
        this.jobsFinished = jobsFinished;
    }

    public Long getJobsFailed() {
        return jobsFailed;
    }

    public void setJobsFailed(Long jobsFailed) {
        this.jobsFailed = jobsFailed;
    }

    public Long getJobDuration() {
        return jobDuration;
    }

    public void setJobDuration(Long jobDuration) {
        this.jobDuration = jobDuration;
    }

    public Long getSuccessfulJobDuration() {
        return successfulJobDuration;
    }

    public void setSuccessfulJobDuration(Long successfulJobDuration) {
        this.successfulJobDuration = successfulJobDuration;
    }

    public Long getProcessorsFailed() {
        return processorsFailed;
    }

    public void setProcessorsFailed(Long processorsFailed) {
        this.processorsFailed = processorsFailed;
    }

    public Long getFlowFilesStarted() {
        return flowFilesStarted;
    }

    public void setFlowFilesStarted(Long flowFilesStarted) {
        this.flowFilesStarted = flowFilesStarted;
    }

    public Long getFlowFilesFinished() {
        return flowFilesFinished;
    }

    public void setFlowFilesFinished(Long flowFilesFinished) {
        this.flowFilesFinished = flowFilesFinished;
    }

    public Long getResultSetCount() {
        return resultSetCount;
    }

    public void setResultSetCount(Long resultSetCount) {
        this.resultSetCount = resultSetCount;
    }
}