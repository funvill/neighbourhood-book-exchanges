#!/bin/bash
# Performance test script to measure build times before/after migration
# Usage: ./test-performance.sh

echo "=== Performance Test: Library Page Generation ==="

# Test a small subset of libraries to measure performance
TEST_LIBRARIES=("00001" "00002" "00003" "00004" "00005")

echo "Testing ${#TEST_LIBRARIES[@]} library pages..."

total_time=0
for lib_id in "${TEST_LIBRARIES[@]}"; do
    echo -n "Testing library $lib_id: "
    
    start_time=$(date +%s%3N)
    
    # Start dev server in background
    npm run dev > /dev/null 2>&1 &
    dev_pid=$!
    
    # Wait for server to start
    sleep 5
    
    # Test the library page
    response=$(curl -s -w "%{http_code}" "http://localhost:3000/library/$lib_id" -o /dev/null)
    
    end_time=$(date +%s%3N)
    duration=$((end_time - start_time))
    
    # Kill dev server
    kill $dev_pid > /dev/null 2>&1
    wait $dev_pid 2>/dev/null
    
    if [[ "$response" == "200" ]]; then
        echo "${duration}ms ✓"
        total_time=$((total_time + duration))
    else
        echo "Failed (HTTP $response) ✗"
    fi
    
    # Wait between tests
    sleep 2
done

if [[ ${#TEST_LIBRARIES[@]} -gt 0 ]]; then
    avg_time=$((total_time / ${#TEST_LIBRARIES[@]}))
    echo ""
    echo "=== Results ==="
    echo "Total time: ${total_time}ms"
    echo "Average per page: ${avg_time}ms"
    echo ""
    
    if [[ $avg_time -lt 5000 ]]; then
        echo "✓ Performance target achieved (< 5 seconds per page)"
    else
        echo "⚠ Performance target not met (>= 5 seconds per page)"
    fi
else
    echo "No libraries tested"
fi